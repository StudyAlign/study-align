from enum import Enum
from typing import Optional, List, Union, Any

from pydantic import BaseModel



# Models defining the distinct step types
class ProcedureConfigStepBase(BaseModel):
    counterbalance: bool
    order: Optional[int]

class ProcedureConfigStepCondition(ProcedureConfigStepBase):
    condition_id: int


class ProcedureConfigStepText(ProcedureConfigStepBase):
    text_id: int


class ProcedureConfigStepQuestionnaire(ProcedureConfigStepBase):
    questionnaire_id: int


class ProcedureConfigStepPause(ProcedureConfigStepBase):
    pause_id: int


ProcedureConfigSteps = List[Union[ProcedureConfigStepCondition, ProcedureConfigStepText, ProcedureConfigStepQuestionnaire, ProcedureConfigStepPause, "ProcedureConfigStepBlock"]]


class ProcedureConfigStepBlockSingle(ProcedureConfigStepBase):
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


ProcedureConfigCreateSingleStep = Union[ProcedureConfigStepCondition, ProcedureConfigStepText, ProcedureConfigStepQuestionnaire, ProcedureConfigStepPause, ProcedureConfigStepBlockSingle]





class ProcedureConfigCreateAllSteps(BaseModel):
    procedure_config_steps: ProcedureConfigSteps
    pass


class ProcedureConfigUpdateAllSteps(BaseModel):
    procedure_config_steps: List[ProcedureConfigStepPatch]
    pass