from datetime import date
from typing import Optional

from pydantic import BaseModel


class ResumeInput(BaseModel):
    resume_text: str
    job_description: str
    first_name_kana: Optional[str] = None
    last_name_kana: Optional[str] = None
    dob: Optional[date] = None
    address_en: Optional[str] = None
    phone: Optional[str] = None
    email: str
