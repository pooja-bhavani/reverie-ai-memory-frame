"""Reverie API — the AI memory frame."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .bedrock import USE_BEDROCK
from .config import settings
from .db import Base, engine, init_pgvector
from .routers import discover, photos
from .storage import UPLOAD_DIR

app = FastAPI(title="Reverie — AI Memory Frame", version="1.0.0")

_origins = settings.cors_list
_allow_all = "*" in _origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if _allow_all else _origins,
    allow_credentials=not _allow_all,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup() -> None:
    init_pgvector()
    Base.metadata.create_all(bind=engine)


# Serve locally-stored images (dev). In prod images come from S3 URLs.
app.mount("/media", StaticFiles(directory=str(UPLOAD_DIR)), name="media")


@app.get("/")
def root() -> dict:
    return {
        "name": "Reverie — AI Memory Frame",
        "database": "Aurora PostgreSQL" if settings.is_postgres else "SQLite (dev)",
        "bedrock": "live" if USE_BEDROCK else "local-fallback",
        "storage": "S3" if settings.s3_bucket else "local",
        "docs": "/docs",
    }


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(photos.router)
app.include_router(discover.router)
