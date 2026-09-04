from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from schemas.identity import UserProfileRead


class PublicUserRead(BaseModel):
    id: UUID
    display_name: str
    profile: UserProfileRead


class ProfileViewerRead(BaseModel):
    user_id: UUID
    display_name: str
    headline: str | None
    viewed_at: datetime


class ProfileViewStatsRead(BaseModel):
    total_views: int
    unique_viewers: int
    period_days: int
    recent_viewers: list[ProfileViewerRead]
