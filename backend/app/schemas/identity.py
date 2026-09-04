from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


ProfileVisibility = Literal["public", "members", "private"]


class AuthIdentityRead(BaseModel):
    provider: str
    email: str

    model_config = ConfigDict(from_attributes=True)


class UserProfileRead(BaseModel):
    headline: str | None
    bio: str | None
    location: str | None
    visibility: ProfileVisibility

    model_config = ConfigDict(from_attributes=True)


class UserRead(BaseModel):
    id: UUID
    display_name: str
    account_status: str
    created_at: datetime
    profile: UserProfileRead | None
    auth_identities: list[AuthIdentityRead]

    model_config = ConfigDict(from_attributes=True)


class UserUpdate(BaseModel):
    display_name: str = Field(min_length=1, max_length=120)

    model_config = ConfigDict(str_strip_whitespace=True)


class UserProfileUpdate(BaseModel):
    headline: str | None = Field(default=None, max_length=200)
    bio: str | None = None
    location: str | None = Field(default=None, max_length=120)
    visibility: ProfileVisibility | None = None

    model_config = ConfigDict(str_strip_whitespace=True)

    @model_validator(mode="after")
    def reject_null_visibility(self):
        if "visibility" in self.model_fields_set and self.visibility is None:
            raise ValueError("Profile visibility cannot be null")
        return self


class UserCompanyRead(BaseModel):
    company_id: UUID
    name: str
    slug: str
    role: str
    status: str
