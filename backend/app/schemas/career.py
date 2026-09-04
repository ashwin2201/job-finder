from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field, model_validator

from schemas.job import JobRead
from schemas.resume import UserResumeRead


ApplicationStatus = Literal[
    "submitted",
    "reviewing",
    "interview",
    "offer",
    "hired",
    "rejected",
    "withdrawn",
]


class SavedJobRead(BaseModel):
    job: JobRead
    saved_at: datetime


class JobApplicationCreate(BaseModel):
    resume_id: UUID | None = None
    cover_letter: str | None = Field(default=None, max_length=10_000)

    model_config = {"str_strip_whitespace": True}


class JobApplicationRead(BaseModel):
    id: UUID
    applicant_id: UUID
    job: JobRead
    resume_id: UUID | None
    cover_letter: str | None
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime


class ApplicantSummary(BaseModel):
    id: UUID
    display_name: str
    headline: str | None


class EmployerApplicationRead(JobApplicationRead):
    applicant: ApplicantSummary
    resume: UserResumeRead | None
    employer_note: str | None


class EmployerApplicationUpdate(BaseModel):
    status: ApplicationStatus | None = None
    employer_note: str | None = Field(default=None, max_length=10_000)

    model_config = {"str_strip_whitespace": True}

    @model_validator(mode="after")
    def require_change(self):
        if not self.model_fields_set:
            raise ValueError("At least one application field is required")
        return self


class JobMatchRefresh(BaseModel):
    resume_id: UUID | None = None
    limit: int = Field(default=20, ge=1, le=100)


class JobMatchRead(BaseModel):
    job: JobRead
    resume_id: UUID | None
    score: float
    reason: str | None
    created_at: datetime
    updated_at: datetime
