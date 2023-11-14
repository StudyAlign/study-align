from typing import Optional

from pydantic import BaseModel

from schema.condition import Condition


class TaskBase(BaseModel):
    name: str
    description: str


class TaskCreate(TaskBase):
    pass


class TaskPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

    class Config:
        extra = 'forbid'


class Task(TaskBase):
    id: int
    condition: Condition

    class Config:
        from_attributes = True
