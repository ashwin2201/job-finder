import hashlib
import re
from collections.abc import Sequence
from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import and_, func, not_, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.sql.elements import ColumnElement
from sqlmodel import Session, select

from models.company import Company
from models.job import Job
from integrations.jobs_matcher.job_matcher import match_jobs_tfidf
from integrations.jobs_matcher.scraper import scrape_jobs


def list_jobs(session: Session) -> list[Job]:
    statement = (
        select(Job)
        .where(Job.status == "published")
        .options(selectinload(Job.company))
    )
    return list(session.exec(statement).all())


def list_jobs_page(
    session: Session,
    page: int,
    page_size: int,
    *,
    search_query: str | None = None,
    company: str | None = None,
    work_styles: Sequence[str] = (),
    languages: Sequence[str] = (),
    visa_support: bool = False,
) -> tuple[list[Job], int]:
    criteria = _job_filter_criteria(
        search_query=search_query,
        company=company,
        work_styles=work_styles,
        languages=languages,
        visa_support=visa_support,
    )

    total_statement = (
        select(func.count(Job.id))
        .join(Company)
        .where(*criteria)
    )
    total = session.exec(total_statement).one()

    statement = (
        select(Job)
        .join(Company)
        .where(*criteria)
        .order_by(
            Job.published_at.is_(None),
            Job.published_at.desc(),
            Job.id,
        )
        .offset((page - 1) * page_size)
        .limit(page_size)
        .options(selectinload(Job.company))
    )
    jobs = list(session.exec(statement).all())
    return jobs, total


def _escaped_contains(column, value: str) -> ColumnElement[bool]:
    escaped = (
        value.casefold()
        .replace("\\", "\\\\")
        .replace("%", "\\%")
        .replace("_", "\\_")
    )
    return func.lower(column).like(f"%{escaped}%", escape="\\")


def _job_text_contains(value: str) -> ColumnElement[bool]:
    return or_(
        _escaped_contains(Job.title, value),
        _escaped_contains(Job.location, value),
        _escaped_contains(Job.description, value),
    )


def _job_filter_criteria(
    *,
    search_query: str | None,
    company: str | None,
    work_styles: Sequence[str],
    languages: Sequence[str],
    visa_support: bool,
) -> list[ColumnElement[bool]]:
    criteria: list[ColumnElement[bool]] = [Job.status == "published"]

    if search_query and (normalized_query := search_query.strip()):
        criteria.append(
            or_(
                _job_text_contains(normalized_query),
                _escaped_contains(Company.name, normalized_query),
            )
        )

    if company:
        criteria.append(Company.name == company)

    contains_hybrid = _job_text_contains("hybrid")
    contains_remote = _job_text_contains("remote")

    work_style_predicates = {
        "Hybrid": contains_hybrid,
        "Remote": and_(not_(contains_hybrid), contains_remote),
        "On-site": and_(
            not_(contains_hybrid),
            not_(contains_remote),
            or_(
                _job_text_contains("on-site"),
                _job_text_contains("onsite"),
                _job_text_contains("on site"),
                _job_text_contains("in office"),
            ),
        ),
    }
    if work_styles:
        criteria.append(
            or_(*(work_style_predicates[value] for value in work_styles))
        )

    contains_english = _job_text_contains("english")
    contains_japanese = _job_text_contains("japanese")
    language_predicates = {
        "English OK": contains_english,
        "Japanese Required": and_(not_(contains_english), contains_japanese),
        "No Japanese Required": and_(
            not_(contains_english),
            not_(contains_japanese),
        ),
    }
    if languages:
        criteria.append(
            or_(*(language_predicates[value] for value in languages))
        )

    if visa_support:
        criteria.append(_job_text_contains("visa"))

    return criteria


def get_job(session: Session, job_id: UUID) -> Job | None:
    statement = (
        select(Job)
        .where(Job.id == job_id, Job.status == "published")
        .options(selectinload(Job.company))
    )
    return session.exec(statement).first()


def _company_slug(name: str) -> str:
    slug = re.sub(r"[^\w]+", "-", name.casefold()).strip("-")
    if slug:
        return slug
    digest = hashlib.sha256(name.encode("utf-8")).hexdigest()[:12]
    return f"company-{digest}"


def _get_or_create_company(session: Session, name: str) -> Company:
    slug = _company_slug(name)
    company = session.exec(select(Company).where(Company.slug == slug)).first()

    if company is not None and company.name != name:
        digest = hashlib.sha256(name.encode("utf-8")).hexdigest()[:8]
        slug = f"{slug}-{digest}"
        company = session.exec(select(Company).where(Company.slug == slug)).first()

    if company is None:
        company = Company(name=name, slug=slug)
        session.add(company)
        session.flush()

    return company


def seed_jobs_if_empty(session: Session) -> None:
    existing_job = session.exec(select(Job.id)).first()
    if existing_job is not None:
        return

    for scraped_job in scrape_jobs():
        company = _get_or_create_company(session, scraped_job["company"])
        session.add(
            Job(
                title=scraped_job["title"],
                company_id=company.id,
                status="published",
                published_at=datetime.now(timezone.utc),
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
    return [jobs[index] for index in ranked_indices.tolist() if index < len(jobs)]
