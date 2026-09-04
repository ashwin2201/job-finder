from uuid import UUID

from fastapi import APIRouter, Depends, Query, Response, status
from sqlmodel import Session

from core.auth import get_current_user, require_company_roles
from core.database import get_session
from models.company import CompanyMembership
from models.identity import User
from schemas.career import (
    ApplicationStatus,
    EmployerApplicationRead,
    EmployerApplicationUpdate,
    JobApplicationCreate,
    JobApplicationRead,
    JobMatchRead,
    JobMatchRefresh,
    SavedJobRead,
)
from services.career import (
    create_application,
    dismiss_job_match,
    list_candidate_applications,
    list_company_applications,
    list_job_matches,
    list_saved_jobs,
    refresh_job_matches,
    save_job,
    unsave_job,
    update_company_application,
    withdraw_application,
)


router = APIRouter(prefix="/api")
employer = require_company_roles("owner", "admin", "recruiter")


@router.get("/me/saved-jobs", response_model=list[SavedJobRead])
def read_saved_jobs(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_saved_jobs(session, current_user.id)


@router.put("/me/saved-jobs/{job_id}", response_model=SavedJobRead)
def put_saved_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return save_job(session, current_user.id, job_id)


@router.delete(
    "/me/saved-jobs/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_saved_job(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Response:
    unsave_job(session, current_user.id, job_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post(
    "/jobs/{job_id}/applications",
    response_model=JobApplicationRead,
    status_code=status.HTTP_201_CREATED,
)
def post_job_application(
    job_id: UUID,
    data: JobApplicationCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_application(session, current_user.id, job_id, data)


@router.get("/me/applications", response_model=list[JobApplicationRead])
def read_my_applications(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_candidate_applications(session, current_user.id)


@router.post(
    "/me/applications/{application_id}/withdraw",
    response_model=JobApplicationRead,
)
def withdraw_my_application(
    application_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return withdraw_application(session, current_user.id, application_id)


@router.get(
    "/companies/{company_id}/applications",
    response_model=list[EmployerApplicationRead],
)
def read_company_applications(
    company_id: UUID,
    job_id: UUID | None = Query(default=None),
    application_status: ApplicationStatus | None = Query(
        default=None,
        alias="status",
    ),
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    return list_company_applications(
        session,
        company_id,
        job_id=job_id,
        application_status=application_status,
    )


@router.patch(
    "/companies/{company_id}/applications/{application_id}",
    response_model=EmployerApplicationRead,
)
def patch_company_application(
    company_id: UUID,
    application_id: UUID,
    data: EmployerApplicationUpdate,
    _: CompanyMembership = Depends(employer),
    session: Session = Depends(get_session),
):
    return update_company_application(
        session,
        company_id,
        application_id,
        data,
    )


@router.get("/me/job-matches", response_model=list[JobMatchRead])
def read_job_matches(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_job_matches(session, current_user.id)


@router.post("/me/job-matches/refresh", response_model=list[JobMatchRead])
def refresh_my_job_matches(
    data: JobMatchRefresh,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return refresh_job_matches(
        session,
        current_user.id,
        resume_id=data.resume_id,
        limit=data.limit,
    )


@router.delete(
    "/me/job-matches/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job_match(
    job_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Response:
    dismiss_job_match(session, current_user.id, job_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
