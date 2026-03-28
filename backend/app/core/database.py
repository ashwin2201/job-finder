from contextlib import asynccontextmanager
from typing import Generator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine

from app.core.config import settings


connect_args = {"check_same_thread": False} if settings.pg_conn.startswith("sqlite") else {}
engine = create_engine(settings.pg_conn, echo=False, connect_args=connect_args)


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
    from app.services.jobs import seed_jobs_if_empty

    @asynccontextmanager
    async def lifespan(app: FastAPI):
        create_db_and_tables()
        with Session(engine) as session:
            seed_jobs_if_empty(session)
        yield

    return lifespan
