from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


class StudyBase(BaseModel):
    name: str
    startDate: datetime
    endDate: datetime
    isActive: bool


class StudyCreate(StudyBase):
    description: str
    consent: str

    class Config:
        extra = 'forbid'


class StudyUpdate(BaseModel):
    name: Optional[str]
    startDate: Optional[datetime]
    description: Optional[str]
    consent: Optional[str]
    endDate: Optional[datetime]
    isActive: Optional[bool]

    class Config:
        extra = 'forbid'


class Study(StudyBase):
    id: int

    class Config:
        orm_mode = True


class StudyDetails(StudyBase):
    id: int
    description: str
    consent: str

    class Config:
        orm_mode = True