from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ProcedureProgressStateEnum(str, Enum):
    start_experiment = "start_experiment"
    end_experiment = "end_experiment"
    start_step = "start_step"
    end_step = "end_step"
    pushed_step = "pushed_step"


class ProcedureProgressBase(BaseModel):
    state: ProcedureProgressStateEnum
    time: datetime


class ProcedureProgressCreate(ProcedureProgressBase):
    participant_id: int
    procedure_step_id: Optional[int] = None


class ProcedureProgress(ProcedureProgressBase):
    id: int

    participant_id: int
    procedure_step_id: int

    class Config:
        from_attributes = True
