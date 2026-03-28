from datetime import date, datetime
from typing import Optional

from sqlmodel import Field, SQLModel

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
