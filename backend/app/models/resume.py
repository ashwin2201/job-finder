from datetime import date, datetime, timezone
from typing import Optional
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, Column, DateTime, Index, text
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)

class ResumeSubmission(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resume_text: str
    job_description: str
    first_name_kana: Optional[str] = None
    last_name_kana: Optional[str] = None
    dob: Optional[date] = None
    address_en: Optional[str] = None
    phone: Optional[str] = None
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class GeneratedResume(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    resume_submission_id: Optional[int] = Field(default=None, foreign_key="resumesubmission.id")
    resume_jp: str
    flagged_casual: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)


class UserResume(SQLModel, table=True):
    __tablename__ = "user_resumes"
    __table_args__ = (
        CheckConstraint(
            "status IN ('active', 'archived')",
            name="ck_user_resumes_status",
        ),
        Index(
            "uq_user_resumes_active_primary",
            "user_id",
            unique=True,
            postgresql_where=text("is_primary AND status = 'active'"),
            sqlite_where=text("is_primary = 1 AND status = 'active'"),
        ),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        ondelete="CASCADE",
    )
    title: str = Field(max_length=200)
    content: str
    status: str = Field(default="active", max_length=32, index=True)
    is_primary: bool = Field(default=False, index=True)
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class ResumeFeedback(SQLModel, table=True):
    __tablename__ = "resume_feedback"
    __table_args__ = (
        CheckConstraint(
            "score IS NULL OR (score >= 0 AND score <= 100)",
            name="ck_resume_feedback_score",
        ),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    resume_id: UUID = Field(
        foreign_key="user_resumes.id",
        nullable=False,
        index=True,
        ondelete="CASCADE",
    )
    source: str = Field(default="system", max_length=32, index=True)
    summary: str
    strengths: str | None = Field(default=None)
    improvements: str | None = Field(default=None)
    score: int | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
