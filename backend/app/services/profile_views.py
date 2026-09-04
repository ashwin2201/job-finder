from datetime import datetime, timedelta, timezone
from uuid import UUID

from fastapi import HTTPException
from sqlmodel import Session, select

from models.identity import User, UserProfile
from models.profile_view import ProfileView
from schemas.identity import UserProfileRead
from schemas.profile_view import (
    ProfileViewerRead,
    ProfileViewStatsRead,
    PublicUserRead,
)


def _aware(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value


def read_user_profile(
    session: Session,
    viewer: User,
    viewed_user_id: UUID,
) -> PublicUserRead:
    statement = (
        select(User, UserProfile)
        .join(UserProfile, UserProfile.user_id == User.id)
        .where(
            User.id == viewed_user_id,
            User.account_status == "active",
        )
    )
    row = session.exec(statement).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Profile not found")
    viewed_user, profile = row
    if profile.visibility == "private" and viewer.id != viewed_user.id:
        raise HTTPException(status_code=404, detail="Profile not found")

    if viewer.id != viewed_user.id:
        _record_profile_view(session, viewer.id, viewed_user.id)

    return PublicUserRead(
        id=viewed_user.id,
        display_name=viewed_user.display_name,
        profile=UserProfileRead.model_validate(profile),
    )


def _record_profile_view(
    session: Session,
    viewer_user_id: UUID,
    viewed_user_id: UUID,
) -> None:
    latest = session.exec(
        select(ProfileView)
        .where(
            ProfileView.viewer_user_id == viewer_user_id,
            ProfileView.viewed_user_id == viewed_user_id,
        )
        .order_by(ProfileView.viewed_at.desc())
    ).first()
    now = datetime.now(timezone.utc)
    if latest is not None and _aware(latest.viewed_at) >= now - timedelta(hours=1):
        return
    session.add(
        ProfileView(
            viewer_user_id=viewer_user_id,
            viewed_user_id=viewed_user_id,
            viewed_at=now,
        )
    )
    session.commit()


def profile_view_stats(
    session: Session,
    viewed_user_id: UUID,
    *,
    days: int,
) -> ProfileViewStatsRead:
    cutoff = datetime.now(timezone.utc) - timedelta(days=days)
    statement = (
        select(ProfileView, User, UserProfile)
        .join(User, ProfileView.viewer_user_id == User.id)
        .outerjoin(UserProfile, UserProfile.user_id == User.id)
        .where(
            ProfileView.viewed_user_id == viewed_user_id,
            ProfileView.viewed_at >= cutoff,
            User.account_status == "active",
        )
        .order_by(ProfileView.viewed_at.desc())
    )
    rows = list(session.exec(statement).all())
    unique_ids = {view.viewer_user_id for view, _, _ in rows}

    recent_viewers: list[ProfileViewerRead] = []
    seen: set[UUID] = set()
    for view, user, profile in rows:
        if user.id in seen:
            continue
        seen.add(user.id)
        recent_viewers.append(
            ProfileViewerRead(
                user_id=user.id,
                display_name=user.display_name,
                headline=profile.headline if profile else None,
                viewed_at=view.viewed_at,
            )
        )
        if len(recent_viewers) == 25:
            break

    return ProfileViewStatsRead(
        total_views=len(rows),
        unique_viewers=len(unique_ids),
        period_days=days,
        recent_viewers=recent_viewers,
    )
