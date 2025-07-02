from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

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
    return [
        {"id": 1, "title": "Software Engineer", "company": "Tech Corp", "location": "Tokyo"},
        {"id": 2, "title": "Data Scientist", "company": "Data Inc", "location": "Fukuoka"},
        {"id": 3, "title": "Product Manager", "company": "Product Co", "location": "Osaka"}
    ]

@app.get("/api/jobs/{job_id}")
async def get_job_by_id(id: int):
    # mocking db select by id
    return {"id": id, "title": "Sample Job", "company": "Sample Company", "location": "Sample Location"}