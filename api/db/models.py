import uuid
from pydantic import BaseModel, validator, Field
from typing import Optional, List
from datetime import datetime


class User(BaseModel):
    _id: str = Field(default_factory=uuid.uuid4)
    first_name: str
    last_name: str
    email: str
    password: str


class Group(BaseModel):
    _id: str = Field(default_factory=uuid.uuid4)
    name: str
    user_ids: List[str] = Field(default=[])
    owner_id: str
    event_ids: List[str] = Field(default=[])


class Note(BaseModel):
    _id: str = Field(default_factory=uuid.uuid4)
    user_id: str
    object_key: str
    timestamp: datetime


class Gist(BaseModel):
    _id: str = Field(default_factory=uuid.uuid4)
    object_key: str
    timestamp: datetime


class Event(BaseModel):
    _id: str = Field(default_factory=uuid.uuid4)
    name: str
    start: datetime
    end: Optional[datetime] = Field(default=None)
    notes: List[Note] = Field(default=[])
    gist: List[Gist] = Field(default=[])


class LoginInput(BaseModel):
    email: str
    password: str
