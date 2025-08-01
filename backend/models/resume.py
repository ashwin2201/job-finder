from pydantic import BaseModel
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class ResumeInfo(BaseModel):
    text: str
    fullName: str 
    email: str 

class EducationEntry(BaseModel):
    start: date
    end: Optional[date]
    school: str
    degree: Optional[str] = None
    major: Optional[str] = None

class WorkEntry(BaseModel):
    start: date
    end: Optional[date]
    company: str
    role: str
    achievements_en: List[str] = []
    achievements_jp: List[str] = []

class Skill(BaseModel):
    name: str
    level: Optional[str] = None  # e.g. "Advanced"

class ResumeInput(BaseModel):
    # Raw user input (mostly EN) + JD
    first_name: str
    last_name: str
    first_name_kana: Optional[str] = None
    last_name_kana: Optional[str] = None
    dob: Optional[date] = None
    address_en: Optional[str] = None
    phone: Optional[str] = None
    email: str
    education: List[EducationEntry]
    work: List[WorkEntry]
    skills: List[Skill]
    certifications: List[str] = []
    languages: List[str] = []
    jd_text: str  # job description
    target_role_jp: Optional[str] = None  # optional override
