from typing import Annotated, Literal
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session

from core.database import get_session
from schemas.job import JobPage, JobRead
from services.jobs import get_job, list_jobs_page


router = APIRouter(prefix="/api/jobs")


@router.get("", response_model=JobPage)
async def get_jobs(
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    q: Annotated[str | None, Query(max_length=200)] = None,
    company: Annotated[str | None, Query(max_length=200)] = None,
    work_styles: Annotated[
        list[Literal["Remote", "Hybrid", "On-site"]] | None,
        Query(),
    ] = None,
    languages: Annotated[
        list[
            Literal[
                "English OK",
                "Japanese Required",
                "No Japanese Required",
            ]
        ]
        | None,
        Query(),
    ] = None,
    visa_support: bool = False,
    session: Session = Depends(get_session),
):
    jobs, total = list_jobs_page(
        session,
        page,
        page_size,
        search_query=q,
        company=company,
        work_styles=work_styles or (),
        languages=languages or (),
        visa_support=visa_support,
    )
    total_pages = max(1, (total + page_size - 1) // page_size)
    return JobPage(
        items=jobs,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )


@router.get("/{job_id}", response_model=JobRead)
async def get_job_by_id(job_id: UUID, session: Session = Depends(get_session)):
    job = get_job(session, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
