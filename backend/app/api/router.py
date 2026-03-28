from fastapi import APIRouter

from app.api.routes.jobs import router as jobs_router
from app.api.routes.resumes import router as resumes_router


api_router = APIRouter()
api_router.include_router(jobs_router, tags=["jobs"])
api_router.include_router(resumes_router, tags=["resumes"])
