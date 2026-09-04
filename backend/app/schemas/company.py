from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, model_validator


CompanyRole = Literal["owner", "admin", "recruiter", "member"]
MembershipStatus = Literal["active", "suspended"]


class CompanyCreate(BaseModel):
    name: str = Field(min_length=1, max_length=200)

    model_config = ConfigDict(str_strip_whitespace=True)


class CompanyUpdate(BaseModel):
    name: str = Field(min_length=1, max_length=200)

    model_config = ConfigDict(str_strip_whitespace=True)


class CompanyRead(BaseModel):
    id: UUID
    name: str
    slug: str
    status: str
    verification_status: str

    model_config = ConfigDict(from_attributes=True)


class UserSummary(BaseModel):
    id: UUID
    display_name: str
    account_status: str

    model_config = ConfigDict(from_attributes=True)


class CompanyMemberCreate(BaseModel):
    user_id: UUID
    role: CompanyRole = "member"


class CompanyMemberUpdate(BaseModel):
    role: CompanyRole | None = None
    status: MembershipStatus | None = None


class CompanyMemberRead(BaseModel):
    company_id: UUID
    user_id: UUID
    role: CompanyRole
    status: MembershipStatus
    user: UserSummary

    model_config = ConfigDict(from_attributes=True)


class EmployerJobCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    location: str = Field(default="", max_length=200)
    description: str = ""

    model_config = ConfigDict(str_strip_whitespace=True)


class EmployerJobUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    location: str | None = Field(default=None, max_length=200)
    description: str | None = None

    model_config = ConfigDict(str_strip_whitespace=True)

    @model_validator(mode="after")
    def reject_null_fields(self):
        null_fields = {
            field
            for field in self.model_fields_set
            if getattr(self, field) is None
        }
        if null_fields:
            fields = ", ".join(sorted(null_fields))
            raise ValueError(f"Job fields cannot be null: {fields}")
        return self
