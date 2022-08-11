from typing import List, Any, Optional

from pydantic import BaseModel

from schema.procedure_step import ProcedureStep


class ProcedureBase(BaseModel):
    pass


class ProcedureCreate(ProcedureBase):
    pass


class Procedure(ProcedureBase):
    id: int
    study_id: int
    procedure_steps: List[ProcedureStep]

    class Config:
        orm_mode = True


# Dummy models are needed to generate procedures
class ProcedureCondition(BaseModel):
    dummy: bool
    condition_id: Optional[int]


class ProcedureText(BaseModel):
    text_id: int


class ProcedureQuestionnaire(BaseModel):
    questionnaire_id: int


class ProcedurePause(BaseModel):
    pause_id: int
