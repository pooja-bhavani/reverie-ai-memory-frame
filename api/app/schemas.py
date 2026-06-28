"""Pydantic schemas."""
from __future__ import annotations

from pydantic import BaseModel


class SearchRequest(BaseModel):
    query: str
    owner: str = "me"
    limit: int = 24


class IngestUrlRequest(BaseModel):
    url: str
    owner: str = "me"


class FrameModeRequest(BaseModel):
    owner: str = "me"
    mode: str = "shuffle"
    query: str = ""


class AskRequest(BaseModel):
    question: str
    owner: str = "me"


class ReelRequest(BaseModel):
    owner: str = "me"
    mode: str = "shuffle"
    query: str = ""
    limit: int = 8
