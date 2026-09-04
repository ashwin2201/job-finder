from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy.orm import selectinload
from sqlmodel import Session, select

from models.company import Company
from models.job import Job
from schemas.company import EmployerJobCreate, EmployerJobUpdate


def list_company_jobs(session: Session, company_id: UUID) -> list[Job]:
    statement = (
        select(Job)
        .where(Job.company_id == company_id)
        .options(selectinload(Job.company))
        .order_by(Job.published_at.desc(), Job.title)
    )
    return list(session.exec(statement).all())


def get_company_job(
    session: Session,
    company_id: UUID,
    job_id: UUID,
) -> Job | None:
    statement = (
        select(Job)
        .where(Job.company_id == company_id, Job.id == job_id)
        .options(selectinload(Job.company))
    )
    return session.exec(statement).first()


def create_company_job(
    session: Session,
    company: Company,
    data: EmployerJobCreate,
) -> Job:
    job = Job(company=company, status="draft", **data.model_dump())
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


def update_company_job(
    session: Session,
    job: Job,
    data: EmployerJobUpdate,
) -> Job:
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


def publish_company_job(session: Session, job: Job) -> Job:
    job.status = "published"
    job.published_at = datetime.now(timezone.utc)
    session.add(job)
    session.commit()
    session.refresh(job)
    return job


def close_company_job(session: Session, job: Job) -> Job:
    job.status = "closed"
    session.add(job)
    session.commit()
    session.refresh(job)
    return job
