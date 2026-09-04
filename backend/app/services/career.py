from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, select

from integrations.jobs_matcher.job_matcher import score_jobs_tfidf
from models.career import JobApplication, JobMatch, SavedJob
from models.company import Company
from models.identity import User, UserProfile
from models.job import Job
from models.resume import UserResume
from schemas.career import (
    ApplicantSummary,
    EmployerApplicationRead,
    EmployerApplicationUpdate,
    JobApplicationCreate,
    JobApplicationRead,
    JobMatchRead,
    SavedJobRead,
)
from schemas.resume import UserResumeRead
from services.presenters import job_read


APPLICATION_TRANSITIONS = {
    "submitted": {"reviewing", "rejected"},
    "reviewing": {"interview", "rejected"},
    "interview": {"offer", "rejected"},
    "offer": {"hired", "rejected"},
    "hired": set(),
    "rejected": set(),
    "withdrawn": set(),
}


def _published_job(
    session: Session,
    job_id: UUID,
) -> tuple[Job, Company]:
    statement = (
        select(Job, Company)
        .join(Company, Job.company_id == Company.id)
        .where(
            Job.id == job_id,
            Job.status == "published",
            Company.status == "active",
        )
    )
    row = session.exec(statement).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Published job not found")
    return row


def _owned_resume(
    session: Session,
    user_id: UUID,
    resume_id: UUID,
) -> UserResume:
    statement = select(UserResume).where(
        UserResume.id == resume_id,
        UserResume.user_id == user_id,
        UserResume.status == "active",
    )
    resume = session.exec(statement).first()
    if resume is None:
        raise HTTPException(status_code=404, detail="Active resume not found")
    return resume


def save_job(session: Session, user_id: UUID, job_id: UUID) -> SavedJobRead:
    job, company = _published_job(session, job_id)
    saved = session.get(SavedJob, (user_id, job_id))
    if saved is None:
        saved = SavedJob(user_id=user_id, job_id=job_id)
        session.add(saved)
        session.commit()
        session.refresh(saved)
    return SavedJobRead(job=job_read(job, company), saved_at=saved.saved_at)


def list_saved_jobs(session: Session, user_id: UUID) -> list[SavedJobRead]:
    statement = (
        select(SavedJob, Job, Company)
        .join(Job, SavedJob.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(SavedJob.user_id == user_id)
        .order_by(SavedJob.saved_at.desc())
    )
    return [
        SavedJobRead(job=job_read(job, company), saved_at=saved.saved_at)
        for saved, job, company in session.exec(statement).all()
    ]


def unsave_job(session: Session, user_id: UUID, job_id: UUID) -> None:
    saved = session.get(SavedJob, (user_id, job_id))
    if saved is None:
        return
    session.delete(saved)
    session.commit()


def _candidate_application_read(
    application: JobApplication,
    job: Job,
    company: Company,
) -> JobApplicationRead:
    return JobApplicationRead(
        id=application.id,
        applicant_id=application.applicant_id,
        job=job_read(job, company),
        resume_id=application.resume_id,
        cover_letter=application.cover_letter,
        status=application.status,
        applied_at=application.applied_at,
        updated_at=application.updated_at,
    )


def _candidate_application(
    session: Session,
    applicant_id: UUID,
    application_id: UUID,
) -> tuple[JobApplication, Job, Company]:
    statement = (
        select(JobApplication, Job, Company)
        .join(Job, JobApplication.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(
            JobApplication.id == application_id,
            JobApplication.applicant_id == applicant_id,
        )
    )
    row = session.exec(statement).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")
    return row


def create_application(
    session: Session,
    applicant_id: UUID,
    job_id: UUID,
    data: JobApplicationCreate,
) -> JobApplicationRead:
    job, company = _published_job(session, job_id)
    existing = session.exec(
        select(JobApplication).where(
            JobApplication.applicant_id == applicant_id,
            JobApplication.job_id == job_id,
        )
    ).first()
    if existing is not None:
        raise HTTPException(
            status_code=409,
            detail="You have already applied to this job",
        )

    if data.resume_id is not None:
        _owned_resume(session, applicant_id, data.resume_id)

    application = JobApplication(
        applicant_id=applicant_id,
        job_id=job_id,
        resume_id=data.resume_id,
        cover_letter=data.cover_letter,
    )
    session.add(application)
    session.commit()
    session.refresh(application)
    return _candidate_application_read(application, job, company)


def list_candidate_applications(
    session: Session,
    applicant_id: UUID,
) -> list[JobApplicationRead]:
    statement = (
        select(JobApplication, Job, Company)
        .join(Job, JobApplication.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(JobApplication.applicant_id == applicant_id)
        .order_by(JobApplication.updated_at.desc())
    )
    return [
        _candidate_application_read(application, job, company)
        for application, job, company in session.exec(statement).all()
    ]


def withdraw_application(
    session: Session,
    applicant_id: UUID,
    application_id: UUID,
) -> JobApplicationRead:
    application, job, company = _candidate_application(
        session,
        applicant_id,
        application_id,
    )
    if application.status in {"hired", "rejected", "withdrawn"}:
        raise HTTPException(
            status_code=409,
            detail="This application can no longer be withdrawn",
        )
    application.status = "withdrawn"
    application.updated_at = datetime.now(timezone.utc)
    session.add(application)
    session.commit()
    session.refresh(application)
    return _candidate_application_read(application, job, company)


def _employer_application_read(
    application: JobApplication,
    job: Job,
    company: Company,
    applicant: User,
    profile: UserProfile | None,
    resume: UserResume | None,
) -> EmployerApplicationRead:
    return EmployerApplicationRead(
        **_candidate_application_read(application, job, company).model_dump(),
        applicant=ApplicantSummary(
            id=applicant.id,
            display_name=applicant.display_name,
            headline=profile.headline if profile else None,
        ),
        resume=UserResumeRead.model_validate(resume) if resume else None,
        employer_note=application.employer_note,
    )


def _company_application_rows(
    session: Session,
    company_id: UUID,
    *,
    application_id: UUID | None = None,
    job_id: UUID | None = None,
    application_status: str | None = None,
):
    statement = (
        select(
            JobApplication,
            Job,
            Company,
            User,
            UserProfile,
            UserResume,
        )
        .join(Job, JobApplication.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .join(User, JobApplication.applicant_id == User.id)
        .outerjoin(UserProfile, UserProfile.user_id == User.id)
        .outerjoin(UserResume, JobApplication.resume_id == UserResume.id)
        .where(Job.company_id == company_id)
    )
    if application_id is not None:
        statement = statement.where(JobApplication.id == application_id)
    if job_id is not None:
        statement = statement.where(JobApplication.job_id == job_id)
    if application_status is not None:
        statement = statement.where(JobApplication.status == application_status)
    return statement.order_by(JobApplication.updated_at.desc())


def list_company_applications(
    session: Session,
    company_id: UUID,
    *,
    job_id: UUID | None,
    application_status: str | None,
) -> list[EmployerApplicationRead]:
    rows = session.exec(
        _company_application_rows(
            session,
            company_id,
            job_id=job_id,
            application_status=application_status,
        )
    ).all()
    return [
        _employer_application_read(
            application,
            job,
            company,
            applicant,
            profile,
            resume,
        )
        for application, job, company, applicant, profile, resume in rows
    ]


def update_company_application(
    session: Session,
    company_id: UUID,
    application_id: UUID,
    data: EmployerApplicationUpdate,
) -> EmployerApplicationRead:
    row = session.exec(
        _company_application_rows(
            session,
            company_id,
            application_id=application_id,
        )
    ).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Application not found")

    application, job, company, applicant, profile, resume = row
    if data.status is not None and data.status != application.status:
        if data.status not in APPLICATION_TRANSITIONS[application.status]:
            raise HTTPException(
                status_code=409,
                detail=(
                    f"Cannot move application from {application.status} "
                    f"to {data.status}"
                ),
            )
        application.status = data.status
    if "employer_note" in data.model_fields_set:
        application.employer_note = data.employer_note
    application.updated_at = datetime.now(timezone.utc)
    session.add(application)
    session.commit()
    session.refresh(application)
    return _employer_application_read(
        application,
        job,
        company,
        applicant,
        profile,
        resume,
    )


def refresh_job_matches(
    session: Session,
    user_id: UUID,
    *,
    resume_id: UUID | None,
    limit: int,
) -> list[JobMatchRead]:
    if resume_id is None:
        resume = session.exec(
            select(UserResume)
            .where(
                UserResume.user_id == user_id,
                UserResume.status == "active",
            )
            .order_by(UserResume.is_primary.desc(), UserResume.updated_at.desc())
        ).first()
        if resume is None:
            raise HTTPException(status_code=404, detail="Active resume not found")
    else:
        resume = _owned_resume(session, user_id, resume_id)

    job_rows = list(
        session.exec(
            select(Job, Company)
            .join(Company, Job.company_id == Company.id)
            .where(
                Job.status == "published",
                Company.status == "active",
            )
        ).all()
    )
    if not job_rows:
        raise HTTPException(status_code=404, detail="No published jobs available")

    ranked = score_jobs_tfidf(
        resume.content,
        [job.description for job, _ in job_rows],
    )[:limit]

    for match in session.exec(
        select(JobMatch).where(JobMatch.user_id == user_id)
    ).all():
        session.delete(match)

    now = datetime.now(timezone.utc)
    matches: list[JobMatchRead] = []
    for index, score in ranked:
        job, company = job_rows[index]
        match = JobMatch(
            user_id=user_id,
            job_id=job.id,
            resume_id=resume.id,
            score=score,
            reason=f"{round(score * 100)}% resume-to-description similarity",
            created_at=now,
            updated_at=now,
        )
        session.add(match)
        matches.append(
            JobMatchRead(
                job=job_read(job, company),
                resume_id=resume.id,
                score=score,
                reason=match.reason,
                created_at=now,
                updated_at=now,
            )
        )
    session.commit()
    return matches


def list_job_matches(session: Session, user_id: UUID) -> list[JobMatchRead]:
    statement = (
        select(JobMatch, Job, Company)
        .join(Job, JobMatch.job_id == Job.id)
        .join(Company, Job.company_id == Company.id)
        .where(
            JobMatch.user_id == user_id,
            Job.status == "published",
            Company.status == "active",
        )
        .order_by(JobMatch.score.desc(), JobMatch.updated_at.desc())
    )
    return [
        JobMatchRead(
            job=job_read(job, company),
            resume_id=match.resume_id,
            score=match.score,
            reason=match.reason,
            created_at=match.created_at,
            updated_at=match.updated_at,
        )
        for match, job, company in session.exec(statement).all()
    ]


def dismiss_job_match(session: Session, user_id: UUID, job_id: UUID) -> None:
    match = session.get(JobMatch, (user_id, job_id))
    if match is None:
        return
    session.delete(match)
    session.commit()
