from enum import Enum
from typing import Optional, List, Union, Any

from pydantic import BaseModel



# Models defining the distinct step types
class ProcedureConfigStepBase(BaseModel):
    counterbalance: bool


class ProcedureConfigStepCondition(ProcedureConfigStepBase):
    condition_id: int


class ProcedureConfigStepText(ProcedureConfigStepBase):
    text_id: int


class ProcedureConfigStepQuestionnaire(ProcedureConfigStepBase):
    questionnaire_id: int


class ProcedureConfigStepPause(ProcedureConfigStepBase):
    pause_id: int


ProcedureConfigSteps = List[Union[ProcedureConfigStepCondition, ProcedureConfigStepText, ProcedureConfigStepQuestionnaire, ProcedureConfigStepPause, "ProcedureConfigStepBlock"]]


class ProcedureConfigCreateSingleBase(ProcedureConfigStepBase):
    order: Optional[int]


class ProcedureConfigStepCreateSingleCondition(ProcedureConfigCreateSingleBase):
    condition_id: int


class ProcedureConfigStepCreateSingleText(ProcedureConfigCreateSingleBase):
    text_id: int


class ProcedureConfigStepCreateSingleQuestionnaire(ProcedureConfigCreateSingleBase):
    questionnaire_id: int


class ProcedureConfigStepCreateSinglePause(ProcedureConfigCreateSingleBase):
    pause_id: int


class ProcedureConfigStepBlockSingle(ProcedureConfigCreateSingleBase):
    block_id: int


class ProcedureConfigStepBlock(ProcedureConfigStepBlockSingle):
    block: ProcedureConfigSteps


class ProcedureConfigStepPatch(BaseModel):
    id: int
    counterbalance: Optional[bool] = None
    block_id: Optional[int] = None
    block: Optional[List["ProcedureConfigStepPatch"]] = None

    class Config:
        extra = 'forbid'


ProcedureConfigCreateSingleStep = Union[
    ProcedureConfigStepCreateSingleCondition,
    ProcedureConfigStepCreateSingleText,
    ProcedureConfigStepCreateSingleQuestionnaire,
    ProcedureConfigStepCreateSinglePause,
    ProcedureConfigStepBlockSingle
]


class ProcedureConfigCreateAllSteps(BaseModel):
    procedure_config_steps: ProcedureConfigSteps
    pass


class ProcedureConfigUpdateAllSteps(BaseModel):
    procedure_config_steps: List[ProcedureConfigStepPatch]
    pass