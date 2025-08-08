from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from services.resume_generator.pipeline import build_pipeline
from models.resume import ResumeInfo, ResumeInput
from services.jobs_matcher.scraper import scrape_jobs
from services.jobs_matcher.job_matcher import match_jobs_tfidf

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

@app.post("/api/submit-resume")
async def submit_resume(resume_info: ResumeInfo):
    global jobs_db # TODO: refactor to avoid global state

    try:
        print(f"Received resume data: {resume_info}")
        print(f"Resume text: {resume_info.text[:100]}...")
        
        jobs = match_jobs_tfidf(resume_info.text, [job['description'] for job in jobs_db])
        # rank jobs based on the match
        matched_jobs = [jobs_db[i] for i in jobs]
        jobs_db = matched_jobs
        
        return {
            "message": "Resume submitted successfully", 
            "resume": resume_info.text,
            "fullName": resume_info.fullName,
            "email": resume_info.email,
            "matched_jobs": matched_jobs
        }
    except Exception as e:
        print(f"Error processing resume: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate")
async def generate(resume_input: ResumeInput):
    # JD summary via simple truncation or separate LLM call
    pipeline = await build_pipeline()
    
    resume_input["jd_summary"] = resume_input["jd_text"][:800]
    final_text, flagged = await pipeline.ainvoke(resume_input)
    return {"resume_jp": final_text, "flagged_casual": flagged}