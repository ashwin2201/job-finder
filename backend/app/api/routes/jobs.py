from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session

from core.database import get_session
from services.jobs import get_job, list_jobs


router = APIRouter(prefix="/api/jobs")


@router.get("")
async def get_jobs(session: Session = Depends(get_session)):
    return list_jobs(session)


@router.get("/{job_id}")
async def get_job_by_id(job_id: int, session: Session = Depends(get_session)):
    job = get_job(session, job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
