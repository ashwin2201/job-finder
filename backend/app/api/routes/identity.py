from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session

from core.auth import get_current_user
from core.database import get_session
from models.identity import User
from schemas.identity import (
    UserCompanyRead,
    UserProfileRead,
    UserProfileUpdate,
    UserRead,
    UserUpdate,
)
from services.identity import (
    deactivate_user,
    get_user_details,
    list_user_companies,
    update_user,
    update_user_profile,
)


router = APIRouter(prefix="/api/me")


@router.get("", response_model=UserRead)
def read_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return get_user_details(session, current_user.id) or current_user


@router.patch("", response_model=UserRead)
def patch_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return update_user(session, current_user, data)


@router.get("/profile", response_model=UserProfileRead)
def read_my_profile(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    user = get_user_details(session, current_user.id)
    if user is None or user.profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    return user.profile


@router.patch("/profile", response_model=UserProfileRead)
def patch_my_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return update_user_profile(session, current_user, data)


@router.get("/companies", response_model=list[UserCompanyRead])
def read_my_companies(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    return list_user_companies(session, current_user.id)


@router.delete("", status_code=status.HTTP_204_NO_CONTENT)
def delete_me(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Response:
    deactivate_user(session, current_user)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
