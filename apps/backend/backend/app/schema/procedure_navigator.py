from enum import Enum
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ProcedureNavigatorStateEnum(str, Enum):
    in_progress = "in_progress"
    done = "done"


class ProcedureNavigatorSourceEnum(str, Enum):
    condition = "condition"
    limesurvey = "limesurvey"
    surveymonkey = "surveymonkey"


class ProcedureNavigatorConnection(BaseModel):
    procedure_step_id: int
    state: ProcedureNavigatorStateEnum


class ProcedureNavigatorConnectionUpdate(BaseModel):
    source: ProcedureNavigatorSourceEnum
    ext_id: Optional[str] = None
    participant_token: UUID
    procedure_step_id: Optional[int] = None
    state: ProcedureNavigatorStateEnum

