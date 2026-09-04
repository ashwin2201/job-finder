from fastapi import APIRouter

from api.routes.career import router as career_router
from api.routes.companies import router as companies_router
from api.routes.employer_jobs import router as employer_jobs_router
from api.routes.identity import router as identity_router
from api.routes.jobs import router as jobs_router
from api.routes.messaging import router as messaging_router
from api.routes.profile_views import router as profile_views_router
from api.routes.resumes import router as resumes_router
from api.routes.user_resumes import router as user_resumes_router
from api.routes.webhooks import router as webhooks_router


api_router = APIRouter()
api_router.include_router(identity_router, tags=["identity"])
api_router.include_router(companies_router, tags=["companies"])
api_router.include_router(employer_jobs_router, tags=["employer jobs"])
api_router.include_router(jobs_router, tags=["jobs"])
api_router.include_router(career_router, tags=["career"])
api_router.include_router(user_resumes_router, tags=["user resumes"])
api_router.include_router(profile_views_router, tags=["profile views"])
api_router.include_router(messaging_router, tags=["messaging"])
api_router.include_router(resumes_router, tags=["resumes"])
api_router.include_router(webhooks_router, tags=["webhooks"])
