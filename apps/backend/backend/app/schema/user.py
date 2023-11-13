from enum import Enum
import uuid
from typing import Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    firstname: str
    lastname: str
    email: str
    role_id: int
    is_active: bool

class UserCreate(UserBase):
    password: str

class UserUpdate(UserBase):
    name: Optional[str]
    firstname: Optional[str]
    lastname: Optional[str]
    email: Optional[str]
    password: Optional[str]
    role_id: Optional[int]
    is_active: Optional[bool]

    class Config:
        extra = 'forbid'

class User(UserBase):
    id: int

    class Config:
        from_attributes = True
