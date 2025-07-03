from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from services.scraper import scrape_jobs

app = FastAPI()

jobs_db = scrape_jobs()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/jobs")
async def get_jobs():
    return jobs_db

@app.get("/api/jobs/{id}")
async def get_job_by_id(id: int):
    # mocking db select by id
    return jobs_db[id - 1]