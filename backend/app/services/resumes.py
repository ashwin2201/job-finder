import re
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, desc, select

from models.resume import (
    GeneratedResume,
    ResumeFeedback,
    ResumeSubmission,
    UserResume,
)
from schemas.resume import (
    ResumeFeedbackCreate,
    ResumeInput,
    UserResumeCreate,
    UserResumeUpdate,
)
from services.jobs import rank_jobs_by_resume


def save_resume_submission(session: Session, resume_input: ResumeInput) -> ResumeSubmission:
    submission = ResumeSubmission(**resume_input.model_dump())
    session.add(submission)
    session.commit()
    session.refresh(submission)
    return submission


def find_matching_jobs(session: Session, resume_text: str):
    matched_jobs = rank_jobs_by_resume(session, resume_text)
    if not matched_jobs:
        raise HTTPException(status_code=404, detail="No jobs available")
    return matched_jobs


async def generate_resume(session: Session, resume_input: ResumeInput) -> dict:
    try:
        from integrations.resume_generator.rag_pipeline import build_pipeline

        data = resume_input.model_dump()
        data["jd_summary"] = data.get("job_description", "")[:800]

        pipeline = await build_pipeline()
        result = pipeline.invoke(data)
        if isinstance(result, tuple):
            final_text, flagged = result
        else:
            final_text, flagged = result, False

        submission = save_resume_submission(session, resume_input)
        generated_resume = GeneratedResume(
            resume_submission_id=submission.id,
            resume_jp=final_text,
            flagged_casual=flagged,
        )
        session.add(generated_resume)
        session.commit()
        session.refresh(generated_resume)

        return {
            "id": generated_resume.id,
            "resume_jp": final_text,
            "flagged_casual": flagged,
        }
    except HTTPException:
        raise
    except Exception as exc:
        print(f"Error generating resume: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


def get_latest_generated_resume(session: Session) -> GeneratedResume | None:
    return session.exec(
        select(GeneratedResume).order_by(desc(GeneratedResume.created_at))
    ).first()


def get_user_resume(
    session: Session,
    user_id: UUID,
    resume_id: UUID,
    *,
    include_archived: bool = False,
) -> UserResume | None:
    statement = select(UserResume).where(
        UserResume.id == resume_id,
        UserResume.user_id == user_id,
    )
    if not include_archived:
        statement = statement.where(UserResume.status == "active")
    return session.exec(statement).first()


def list_user_resumes(session: Session, user_id: UUID) -> list[UserResume]:
    statement = (
        select(UserResume)
        .where(
            UserResume.user_id == user_id,
            UserResume.status == "active",
        )
        .order_by(UserResume.is_primary.desc(), UserResume.updated_at.desc())
    )
    return list(session.exec(statement).all())


def _clear_primary_resume(
    session: Session,
    user_id: UUID,
    *,
    except_resume_id: UUID | None = None,
) -> None:
    statement = select(UserResume).where(
        UserResume.user_id == user_id,
        UserResume.is_primary.is_(True),
    )
    if except_resume_id is not None:
        statement = statement.where(UserResume.id != except_resume_id)
    changed = False
    for resume in session.exec(statement).all():
        resume.is_primary = False
        session.add(resume)
        changed = True
    if changed:
        session.flush()


def create_user_resume(
    session: Session,
    user_id: UUID,
    data: UserResumeCreate,
) -> UserResume:
    has_active_resume = session.exec(
        select(UserResume.id).where(
            UserResume.user_id == user_id,
            UserResume.status == "active",
        )
    ).first()
    is_primary = data.is_primary or has_active_resume is None
    if is_primary:
        _clear_primary_resume(session, user_id)

    resume = UserResume(
        user_id=user_id,
        title=data.title,
        content=data.content,
        is_primary=is_primary,
    )
    session.add(resume)
    session.commit()
    session.refresh(resume)
    return resume


def update_user_resume(
    session: Session,
    resume: UserResume,
    data: UserResumeUpdate,
) -> UserResume:
    if data.is_primary:
        _clear_primary_resume(
            session,
            resume.user_id,
            except_resume_id=resume.id,
        )

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(resume, field, value)
    resume.updated_at = datetime.now(timezone.utc)
    session.add(resume)
    session.commit()
    session.refresh(resume)
    return resume


def archive_user_resume(session: Session, resume: UserResume) -> None:
    was_primary = resume.is_primary
    resume.status = "archived"
    resume.is_primary = False
    resume.updated_at = datetime.now(timezone.utc)
    session.add(resume)
    session.flush()

    if was_primary:
        replacement = session.exec(
            select(UserResume)
            .where(
                UserResume.user_id == resume.user_id,
                UserResume.status == "active",
                UserResume.id != resume.id,
            )
            .order_by(UserResume.updated_at.desc())
        ).first()
        if replacement is not None:
            replacement.is_primary = True
            session.add(replacement)
    session.commit()


def create_resume_feedback(
    session: Session,
    resume: UserResume,
    data: ResumeFeedbackCreate,
) -> ResumeFeedback:
    feedback = ResumeFeedback(
        resume_id=resume.id,
        **data.model_dump(),
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return feedback


def list_resume_feedback(
    session: Session,
    resume_id: UUID,
) -> list[ResumeFeedback]:
    statement = (
        select(ResumeFeedback)
        .where(ResumeFeedback.resume_id == resume_id)
        .order_by(ResumeFeedback.created_at.desc())
    )
    return list(session.exec(statement).all())


def generate_resume_feedback(
    session: Session,
    resume: UserResume,
) -> ResumeFeedback:
    content = resume.content.casefold()
    checks = {
        "professional summary": any(
            term in content for term in ("summary", "profile", "objective")
        ),
        "experience section": any(
            term in content for term in ("experience", "employment", "work history")
        ),
        "skills section": any(
            term in content for term in ("skills", "technologies", "competencies")
        ),
        "education section": any(
            term in content for term in ("education", "university", "degree")
        ),
        "measurable outcomes": bool(
            re.search(r"\b\d+(?:\.\d+)?%|\b\d+\+|\b\d{2,}\b", content)
        ),
    }
    score = 35
    if len(resume.content) >= 500:
        score += 15
    score += sum(10 for present in checks.values() if present)
    score = min(score, 100)

    present = [name for name, found in checks.items() if found]
    missing = [name for name, found in checks.items() if not found]
    strengths = (
        "Detected " + ", ".join(present) + "."
        if present
        else "The resume provides a usable starting point."
    )
    improvements = (
        "Add or strengthen: " + ", ".join(missing) + "."
        if missing
        else "Tailor achievements and keywords to each target role."
    )
    feedback = ResumeFeedback(
        resume_id=resume.id,
        source="system",
        summary=f"Resume completeness score: {score}/100.",
        strengths=strengths,
        improvements=improvements,
        score=score,
    )
    session.add(feedback)
    session.commit()
    session.refresh(feedback)
    return feedback
