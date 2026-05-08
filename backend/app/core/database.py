from contextlib import asynccontextmanager
from typing import Generator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine

from core.config import settings

import os
from dotenv import load_dotenv

load_dotenv()


connect_args = {"check_same_thread": False} if os.getenv("PG_CONN").startswith("sqlite") else {}
engine = create_engine(os.getenv("PG_CONN"), echo=False, connect_args=connect_args)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session


def configure_cors(app: FastAPI) -> None:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.frontend_origin],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def build_lifespan():
    from services.jobs import seed_jobs_if_empty

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        create_db_and_tables()
        with Session(engine) as session:
            seed_jobs_if_empty(session)
        yield

    return lifespan
