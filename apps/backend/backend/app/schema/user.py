from enum import Enum
import uuid
from typing import Optional
from pydantic import BaseModel


class UserBase(BaseModel):
    name: str
    firstname: Optional[str]
    lastname: Optional[str]
    email: str
    role_id: int
    is_active: bool

class UserCreate(UserBase):
    password: str

class UserRegisterForm(BaseModel):
    name: str
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: str
    password: str

class UserRegister(UserBase):
    name: str
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: str
    password: str
    role_id: int
    is_active: bool
    email_activation_token: uuid.UUID

class UserUpdate(UserBase):
    name: Optional[str] = None
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None
    is_active: Optional[bool] = None

    class Config:
        extra = 'forbid'

class User(UserBase):
    id: int

    class Config:
        from_attributes = True

class UserView(BaseModel):
    id: int
    name: str
    firstname: str
    lastname: str

    class Config:
        orm_mode = True

class UserOrderByFields(str, Enum):
    id = "id"
    name = "name"
    role_id = "role_id"
