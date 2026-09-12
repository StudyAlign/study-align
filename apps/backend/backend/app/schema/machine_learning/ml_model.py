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
    name: Optional[str] = None
    description: Optional[str] = None
    active: Optional[bool] = None
    condition_id: Optional[int] = None
    changelog: Optional[str] = None
    path: Optional[str] = None


class MLModelUpdateDistribute(MLModelUpdateBase):
    description: Optional[str] = None
    active: bool
    condition_id: Optional[int] = None
    path: Optional[str] = None
    changelog: Optional[str] = None


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
