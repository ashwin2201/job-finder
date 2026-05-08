from sqlmodel import Session, select

from models.job import Job
from integrations.jobs_matcher.job_matcher import match_jobs_tfidf
from integrations.jobs_matcher.scraper import scrape_jobs


def list_jobs(session: Session) -> list[Job]:
    return session.exec(select(Job)).all()


def get_job(session: Session, job_id: int) -> Job | None:
    return session.get(Job, job_id)


def seed_jobs_if_empty(session: Session) -> None:
    existing_job = session.exec(select(Job.id)).first()
    if existing_job is not None:
        return

    for scraped_job in scrape_jobs():
        session.add(
            Job(
                title=scraped_job["title"],
                company=scraped_job["company"],
                location=scraped_job["location"],
                description=scraped_job["description"],
            )
        )
    session.commit()


def rank_jobs_by_resume(session: Session, resume_text: str) -> list[Job]:
    jobs = list_jobs(session)
    if not jobs:
        return []

    ranked_indices = match_jobs_tfidf(
        resume_text,
        [job.description for job in jobs],
    )
    ranked_jobs = [jobs[index] for index in ranked_indices.tolist() if index < len(jobs)]

    for job in jobs:
        session.delete(job)
    session.flush()

    for job in ranked_jobs:
        session.add(
            Job(
                title=job.title,
                company=job.company,
                location=job.location,
                description=job.description,
            )
        )

    session.commit()
    return list_jobs(session)
