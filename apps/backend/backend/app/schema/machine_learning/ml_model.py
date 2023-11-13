import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MLModelBase(BaseModel):
    name: str
    description: str
    active: bool
    condition_id: int


class MLModelCreateCloud(MLModelBase):
    path: str
    key: uuid.UUID


class MLModelCreateDistribute(MLModelBase):
    distribute: bool = True


class MLModelUpdateBase(BaseModel):
    name: Optional[str]
    description: Optional[str]
    active: Optional[bool]
    condition_id: Optional[int]
    changelog: Optional[str]
    path: Optional[str]


class MLModelUpdateDistribute(MLModelUpdateBase):
    description: Optional[str]
    active: bool
    condition_id: Optional[int]
    path: Optional[str]
    changelog: Optional[str]


class MLModelUpdateCloud(MLModelUpdateBase):
    key: uuid.UUID


class MLModel(MLModelBase):
    id: int
    time: datetime

    class Config:
        from_attributes = True


class MLModelCloud(MLModel):
    path: str
    key: uuid.UUID


class MLModelDistribute(MLModel):
    pass
