from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from core.auth import require_company_roles
from core.database import get_session
from models.company import CompanyMembership
from schemas.company import EmployerJobCreate, EmployerJobUpdate
from schemas.job import JobRead
from services.employer_jobs import (
    close_company_job,
    create_company_job,
    get_company_job,
    list_company_jobs,
    publish_company_job,
    update_company_job,
)


router = APIRouter(prefix="/api/companies/{company_id}/jobs")

employer = require_company_roles("owner", "admin", "recruiter")


@router.get("", response_model=list[JobRead])
def read_company_jobs(
    company_id: UUID,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    return list_company_jobs(session, company_id)


@router.post("", response_model=JobRead, status_code=status.HTTP_201_CREATED)
def post_company_job(
    data: EmployerJobCreate,
    membership: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    return create_company_job(session, membership.company, data)


def _company_job_or_404(session: Session, company_id: UUID, job_id: UUID):
    job = get_company_job(session, company_id, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/{job_id}", response_model=JobRead)
def read_company_job(
    company_id: UUID,
    job_id: UUID,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    return _company_job_or_404(session, company_id, job_id)


@router.patch("/{job_id}", response_model=JobRead)
def patch_company_job(
    company_id: UUID,
    job_id: UUID,
    data: EmployerJobUpdate,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    job = _company_job_or_404(session, company_id, job_id)
    return update_company_job(session, job, data)


@router.post("/{job_id}/publish", response_model=JobRead)
def publish_job(
    company_id: UUID,
    job_id: UUID,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    job = _company_job_or_404(session, company_id, job_id)
    return publish_company_job(session, job)


@router.post("/{job_id}/close", response_model=JobRead)
def close_job(
    company_id: UUID,
    job_id: UUID,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    job = _company_job_or_404(session, company_id, job_id)
    return close_company_job(session, job)
