import uuid
from pydantic import BaseModel as PydanticBaseModel, validator, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from bson import ObjectId
from pydantic.fields import ModelField


class BaseModel(PydanticBaseModel):
    class Config:
        arbitrary_types_allowed = True


class User(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    first_name: str
    last_name: str
    email: str
    password: str


class Group(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    user_ids: List[ObjectId] = Field(default=[])
    owner_id: ObjectId
    event_ids: List[ObjectId] = Field(default=[])


class Note(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    user_id: ObjectId
    author_name: str
    object_key: str
    timestamp: datetime
    relevance: Optional[float] = Field(default=None)


class Gist(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    blob_key: str
    timestamp: datetime


class Event(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    start: datetime
    end: Optional[datetime] = Field(default=None)
    notes: List[Note] = Field(default=[])
    gists: List[Gist] = Field(default=[])


class LoginInput(BaseModel):
    email: str
    password: str
