from fastapi import APIRouter, Depends
from sqlmodel import Session

from app.core.database import get_session
from app.schemas.resume import ResumeInput
from app.services.resumes import (
    find_matching_jobs,
    generate_resume,
    get_latest_generated_resume,
    save_resume_submission,
)


router = APIRouter(prefix="/api")


@router.post("/submit-resume")
async def submit_resume(resume_input: ResumeInput, session: Session = Depends(get_session)):
    submission = save_resume_submission(session, resume_input)
    matched_jobs = find_matching_jobs(session, resume_input.resume_text)
    return {
        "message": "Resume submitted successfully",
        "submission_id": submission.id,
        "email": resume_input.email,
        "matched_jobs": matched_jobs,
    }


@router.post("/generate-resume")
async def generate_resume_endpoint(
    resume_input: ResumeInput,
    session: Session = Depends(get_session),
):
    return await generate_resume(session, resume_input)


@router.get("/generate-resume")
async def get_resume(session: Session = Depends(get_session)):
    latest_resume = get_latest_generated_resume(session)
    if latest_resume is None:
        return {"error": "No resume found"}
    return {
        "id": latest_resume.id,
        "resume_jp": latest_resume.resume_jp,
        "flagged_casual": latest_resume.flagged_casual,
    }
