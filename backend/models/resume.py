from pydantic import BaseModel

class ResumeInfo(BaseModel):
    text: str
    fullName: str 
    email: str 
