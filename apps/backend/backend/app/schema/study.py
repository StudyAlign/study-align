from datetime import datetime
from typing import List, Optional

from enum import Enum
from pydantic import BaseModel


class CurrentSetupStepEnum(str, Enum):
    study = "study"
    procedure = "procedure"
    integrations = "integrations"
    check = "check"
    done = "done"


class StudyBase(BaseModel):
    name: str
    startDate: datetime
    endDate: datetime
    is_active: bool
    owner_id: int
    invite_only: bool


class StudyCreate(StudyBase):
    description: str
    consent: str
    planned_amount_participants: Optional[int]
    current_setup_step: Optional[CurrentSetupStepEnum]

    class Config:
        extra = 'forbid'


class StudyUpdate(BaseModel):
    name: Optional[str]
    startDate: Optional[datetime]
    description: Optional[str]
    consent: Optional[str]
    endDate: Optional[datetime]
    is_active: Optional[bool]
    owner_id: Optional[int]
    invite_only: Optional[bool]
    planned_number_participants: Optional[int]
    current_setup_step: Optional[CurrentSetupStepEnum]

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


class StudySetupInfo(StudyBase):
    id: int
    planned_number_participants: int
    current_setup_step: CurrentSetupStepEnum

    class Config:
        orm_mode = True