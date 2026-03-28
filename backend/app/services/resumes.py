from fastapi import HTTPException
from sqlmodel import Session, desc, select

from app.integrations.resume_generator.rag_pipeline import build_pipeline
from app.models.resume import GeneratedResume, ResumeSubmission
from app.schemas.resume import ResumeInput
from app.services.jobs import rank_jobs_by_resume


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
