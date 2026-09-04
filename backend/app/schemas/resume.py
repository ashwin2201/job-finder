from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field, model_validator


class ResumeInput(BaseModel):
    resume_text: str
    job_description: str
    first_name_kana: Optional[str] = None
    last_name_kana: Optional[str] = None
    dob: Optional[date] = None
    address_en: Optional[str] = None
    phone: Optional[str] = None
    email: str


class UserResumeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    content: str = Field(min_length=1)
    is_primary: bool = False

    model_config = {"str_strip_whitespace": True}


class UserResumeUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    content: str | None = Field(default=None, min_length=1)
    is_primary: bool | None = None

    model_config = {"str_strip_whitespace": True}

    @model_validator(mode="after")
    def require_change(self):
        if not self.model_fields_set:
            raise ValueError("At least one resume field is required")
        return self


class UserResumeRead(BaseModel):
    id: UUID
    user_id: UUID
    title: str
    content: str
    status: str
    is_primary: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ResumeFeedbackCreate(BaseModel):
    source: str = Field(default="system", min_length=1, max_length=32)
    summary: str = Field(min_length=1)
    strengths: str | None = None
    improvements: str | None = None
    score: int | None = Field(default=None, ge=0, le=100)

    model_config = {"str_strip_whitespace": True}


class ResumeFeedbackRead(BaseModel):
    id: UUID
    resume_id: UUID
    source: str
    summary: str
    strengths: str | None
    improvements: str | None
    score: int | None
    created_at: datetime

    model_config = {"from_attributes": True}
