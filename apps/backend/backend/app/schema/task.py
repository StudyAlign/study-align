from typing import Optional

from pydantic import BaseModel

from schema.condition import Condition


class TaskBase(BaseModel):
    name: str
    description: str


class TaskCreate(TaskBase):
    pass


class TaskPatch(BaseModel):
    name: Optional[str]
    description: Optional[str]

    class Config:
        extra = 'forbid'


class Task(TaskBase):
    id: int
    condition: Condition

    class Config:
        orm_mode = True
