from enum import Enum
import uuid
from typing import Optional
from pydantic import BaseModel


class GroupBase(BaseModel):
    name: str
    owner_id: int

class GroupCreate(GroupBase):
    pass

class GroupUpdate(GroupBase):
    name: Optional[str] = None
    owner_id: Optional[int] = None
    slug: Optional[str] = None

    class Config:
        extra = 'forbid'

class Group(GroupBase):
    id: int
    slug: str


    class Config:
        from_attributes = True
