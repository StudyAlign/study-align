import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class MLModelBase(BaseModel):
    name: str
    time: datetime
    description: str
    active: bool
    condition_id: int


class MLModelCreateCloud(MLModelBase):
    path: Optional[str]
    distribute: bool = False
    key: uuid.UUID


class MLModelCreateDistribute(MLModelBase):
    distribute: bool = True


class MLModelUpdate(MLModelBase):
    name: Optional[str]
    time: Optional[datetime]
    description: Optional[str]
    active: Optional[bool]
    condition_id: Optional[int]
    path: Optional[str]
    changelog: Optional[str]
    key: Optional[uuid.UUID]


class MLModel(MLModelBase):
    id: int
    key: Optional[uuid.UUID]

    class Config:
        orm_mode = True


class MLModelCloud(MLModel):
    pass


class MLModelDistribute(MLModel):
    pass
