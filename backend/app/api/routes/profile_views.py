from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlmodel import Session

from core.auth import get_current_user
from core.database import get_session
from models.identity import User
from schemas.profile_view import ProfileViewStatsRead, PublicUserRead
from services.profile_views import profile_view_stats, read_user_profile


router = APIRouter(prefix="/api")


@router.get("/users/{user_id}", response_model=PublicUserRead)
def read_public_user(
    user_id: UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return read_user_profile(session, current_user, user_id)


@router.get("/me/profile-views", response_model=ProfileViewStatsRead)
def read_profile_views(
    days: Annotated[int, Query(ge=1, le=365)] = 30,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return profile_view_stats(session, current_user.id, days=days)
