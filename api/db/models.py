import uuid
from pydantic import BaseModel, validator, Field
from typing import Optional, List
from datetime import datetime


class User(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    first_name: str
    last_name: str
    email: str
    password_hash: str


class Group(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    users = List[User] = Field(default=[])
    event_ids = List[str] = Field(default=[])


class Note(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    user_id: str
    object_key: str
    timestamp: datetime


class Gist(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    object_key: str
    timestamp: datetime


class Event(BaseModel):
    id: str = Field(default_factory=uuid.uuid4, alias="_id")
    name: str
    start: datetime
    end: Optional[datetime] = Field(default=None)
    notes: List[Note] = Field(default=[])
    gist: List[Gist] = Field(default=[])
