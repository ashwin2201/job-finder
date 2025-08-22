from pydantic import BaseModel
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ResumeInput(BaseModel):
    # Raw user input (mostly EN) + JD
    resume_text: str
    job_description: str
    first_name_kana: Optional[str] = None
    last_name_kana: Optional[str] = None
    dob: Optional[date] = None
    address_en: Optional[str] = None
    phone: Optional[str] = None
    email: str

