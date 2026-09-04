from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import CheckConstraint, Column, DateTime, UniqueConstraint
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class SavedJob(SQLModel, table=True):
    __tablename__ = "saved_jobs"

    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        ondelete="CASCADE",
    )
    job_id: UUID = Field(
        primary_key=True,
        foreign_key="jobs.id",
        index=True,
        ondelete="CASCADE",
    )
    saved_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class JobApplication(SQLModel, table=True):
    __tablename__ = "job_applications"
    __table_args__ = (
        UniqueConstraint(
            "applicant_id",
            "job_id",
            name="uq_job_applications_applicant_job",
        ),
        CheckConstraint(
            "status IN "
            "('submitted', 'reviewing', 'interview', 'offer', "
            "'hired', 'rejected', 'withdrawn')",
            name="ck_job_applications_status",
        ),
    )

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    applicant_id: UUID = Field(
        foreign_key="users.id",
        nullable=False,
        index=True,
        ondelete="CASCADE",
    )
    job_id: UUID = Field(
        foreign_key="jobs.id",
        nullable=False,
        index=True,
        ondelete="RESTRICT",
    )
    resume_id: UUID | None = Field(
        default=None,
        foreign_key="user_resumes.id",
        ondelete="SET NULL",
    )
    cover_letter: str | None = Field(default=None)
    status: str = Field(default="submitted", max_length=32, index=True)
    employer_note: str | None = Field(default=None)
    applied_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )


class JobMatch(SQLModel, table=True):
    __tablename__ = "job_matches"
    __table_args__ = (
        CheckConstraint(
            "score >= 0 AND score <= 1",
            name="ck_job_matches_score",
        ),
    )

    user_id: UUID = Field(
        primary_key=True,
        foreign_key="users.id",
        ondelete="CASCADE",
    )
    job_id: UUID = Field(
        primary_key=True,
        foreign_key="jobs.id",
        index=True,
        ondelete="CASCADE",
    )
    resume_id: UUID | None = Field(
        default=None,
        foreign_key="user_resumes.id",
        ondelete="SET NULL",
    )
    score: float = Field(index=True)
    reason: str | None = Field(default=None)
    created_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
    updated_at: datetime = Field(
        default_factory=utc_now,
        sa_column=Column(DateTime(timezone=True), nullable=False),
    )
