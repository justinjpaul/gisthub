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
    user_ids: List[str] = Field(default=[])
    owner_id: ObjectId
    event_ids: List[str] = Field(default=[])


class Note(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    user_id: str
    object_key: str
    timestamp: datetime


class Gist(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    object_key: str
    timestamp: datetime


class Event(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    name: str
    start: datetime
    end: Optional[datetime] = Field(default=None)
    notes: List[Note] = Field(default=[])
    gist: List[Gist] = Field(default=[])


class LoginInput(BaseModel):
    email: str
    password: str
