from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from core.auth import get_current_user
from core.database import get_session
from models.identity import User
from schemas.resume import (
    ResumeFeedbackCreate,
    ResumeFeedbackRead,
    UserResumeCreate,
    UserResumeRead,
    UserResumeUpdate,
)
from services.resumes import (
    archive_user_resume,
    create_resume_feedback,
    create_user_resume,
    generate_resume_feedback,
    get_user_resume,
    list_resume_feedback,
    list_user_resumes,
    update_user_resume,
)


router = APIRouter(prefix="/api/me/resumes")


def _resume_or_404(
    session: Session,
    user_id: UUID,
    resume_id: UUID,
):
    resume = get_user_resume(session, user_id, resume_id)
    if resume is None:
        raise HTTPException(status_code=404, detail="Resume not found")
    return resume


@router.get("", response_model=list[UserResumeRead])
def read_resumes(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_user_resumes(session, current_user.id)


@router.post(
    "",
    response_model=UserResumeRead,
    status_code=status.HTTP_201_CREATED,
)
def post_resume(
    data: UserResumeCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return create_user_resume(session, current_user.id, data)


@router.get("/{resume_id}", response_model=UserResumeRead)
def read_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return _resume_or_404(session, current_user.id, resume_id)


@router.patch("/{resume_id}", response_model=UserResumeRead)
def patch_resume(
    resume_id: UUID,
    data: UserResumeUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    resume = _resume_or_404(session, current_user.id, resume_id)
    return update_user_resume(session, resume, data)


@router.delete("/{resume_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_resume(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Response:
    resume = _resume_or_404(session, current_user.id, resume_id)
    archive_user_resume(session, resume)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get(
    "/{resume_id}/feedback",
    response_model=list[ResumeFeedbackRead],
)
def read_feedback(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    resume = _resume_or_404(session, current_user.id, resume_id)
    return list_resume_feedback(session, resume.id)


@router.post(
    "/{resume_id}/feedback",
    response_model=ResumeFeedbackRead,
    status_code=status.HTTP_201_CREATED,
)
def post_feedback(
    resume_id: UUID,
    data: ResumeFeedbackCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    resume = _resume_or_404(session, current_user.id, resume_id)
    return create_resume_feedback(session, resume, data)


@router.post(
    "/{resume_id}/feedback/generate",
    response_model=ResumeFeedbackRead,
    status_code=status.HTTP_201_CREATED,
)
def generate_feedback(
    resume_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    resume = _resume_or_404(session, current_user.id, resume_id)
    return generate_resume_feedback(session, resume)
