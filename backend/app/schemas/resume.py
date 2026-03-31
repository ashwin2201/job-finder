from datetime import date

from pydantic import BaseModel


class ResumeInput(BaseModel):
    resume_text: str
    job_description: str
    first_name_kana: str | None = None
    last_name_kana: str | None = None
    dob: date | None = None
    address_en: str | None = None
    phone: str | None = None
    email: str
