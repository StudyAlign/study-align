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
    condition_id: Optional[int] = None
    text_id: Optional[int] = None
    questionnaire_id: Optional[int] = None
    pause_id: Optional[int] = None

    class Config:
        from_attributes = True


class ProcedureStepPlanned(BaseModel):
    condition_id: Optional[int] = None
    text_id: Optional[int] = None
    questionnaire_id: Optional[int] = None
    pause_id: Optional[int] = None
