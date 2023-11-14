from datetime import datetime
from typing import List, Optional, Union

from enum import Enum
from pydantic import BaseModel

from schema.procedure_step import ProcedureStep, ProcedureStepPlanned


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
    planned_number_participants: Optional[int] = None
    planned_procedure: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None
    current_setup_step: Optional[CurrentSetupStepEnum] = None

    class Config:
        extra = 'forbid'


class StudyUpdate(BaseModel):
    name: Optional[str] = None
    startDate: Optional[datetime] = None
    description: Optional[str] = None
    consent: Optional[str] = None
    endDate: Optional[datetime] = None
    is_active: Optional[bool] = None
    owner_id: Optional[int] = None
    invite_only: Optional[bool] = None
    planned_number_participants: Optional[int] = None
    planned_procedure: Optional[List[ProcedureStepPlanned]] = None
    current_setup_step: Optional[CurrentSetupStepEnum] = None

    class Config:
        extra = 'forbid'


class Study(StudyBase):
    id: int

    class Config:
        from_attributes = True


class StudyDetails(StudyBase):
    id: int
    description: str
    consent: str

    class Config:
        from_attributes = True


class StudySetupInfo(StudyBase):
    id: int
    planned_number_participants: int
    planned_procedure: Optional[List[ProcedureStepPlanned]]
    current_setup_step: CurrentSetupStepEnum

    class Config:
        from_attributes = True