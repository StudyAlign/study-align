from datetime import datetime
from typing import List, Optional, Union

from enum import Enum
from pydantic import BaseModel

from schema.procedure_config import ProcedureConfigImport
from schema.procedure_step import ProcedureStepPlanned


class CurrentSetupStepEnum(str, Enum):
    information = "information"
    study = "study"
    procedure = "procedure"
    integrations = "integrations"
    check = "check"
    done = "done"

class StudyStateEnum(str, Enum):
    setup = "setup"
    running = "running"
    finished = "finished"


class StudyBase(BaseModel):
    name: str
    startDate: datetime
    endDate: datetime
    state: StudyStateEnum
    owner_id: int
    invite_only: bool


class StudyCreate(StudyBase):
    description: str
    consent: str
    planned_number_participants: Optional[int] = None
    planned_procedure: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None
    current_setup_step: Optional[CurrentSetupStepEnum] = None
    state: Optional[StudyStateEnum] = None

    class Config:
        extra = 'forbid'


class StudyUpdate(BaseModel):
    name: Optional[str] = None
    startDate: Optional[datetime] = None
    description: Optional[str] = None
    consent: Optional[str] = None
    endDate: Optional[datetime] = None
    state: Optional[StudyStateEnum] = None
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


class StudyExportDetails(BaseModel):
    name: str
    startDate: datetime
    endDate: datetime
    invite_only: bool
    description: str
    consent: str
    planned_number_participants: int

    class Config:
        from_attributes = True


class StudyImport(BaseModel):
    study: StudyExportDetails
    procedure_config: ProcedureConfigImport


class StudyDuplicateDetails(StudyExportDetails):
    owner_id: int

    class Config:
        from_attributes = True


class StudyDuplicate(BaseModel):
    study: StudyDuplicateDetails
    procedure_config: ProcedureConfigImport

    class Config:
        from_attributes = True
