from datetime import date, datetime

from sqlmodel import Field, SQLModel

class ResumeSubmission(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    resume_text: str
    job_description: str
    first_name_kana: str | None = None
    last_name_kana: str | None = None
    dob: date | None = None
    address_en: str | None = None
    phone: str | None = None
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

class GeneratedResume(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    resume_submission_id: int | None = Field(default=None, foreign_key="resumesubmission.id")
    resume_jp: str
    flagged_casual: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
