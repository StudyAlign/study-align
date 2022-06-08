from enum import Enum
from typing import Optional

from pydantic import BaseModel


class ProcedureStepBase(BaseModel):
    order: int


class ProcedureStepCreate(ProcedureStepBase):
    pass


class ProcedureStep(ProcedureStepBase):
    id: int

    procedure_id: int
    condition_id: Optional[int]
    text_id: Optional[int]
    questionnaire_id: Optional[int]
    pause_id: Optional[int]

    class Config:
        orm_mode = True
