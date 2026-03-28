import uvicorn
from fastapi import FastAPI

from app.api.router import api_router
from app.core.database import build_lifespan, configure_cors


def create_app() -> FastAPI:
    application = FastAPI(lifespan=build_lifespan())
    configure_cors(application)
    application.include_router(api_router)
    return application

app = create_app()

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
