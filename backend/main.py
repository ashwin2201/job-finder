from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
    return {"hello world": "Welcome to the Job Finder API"}