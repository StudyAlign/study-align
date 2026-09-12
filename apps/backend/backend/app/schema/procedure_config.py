from typing import List, Any, Optional, Union

from pydantic import BaseModel

from schema.condition import ConditionBase
from schema.pause import PauseBase
from schema.questionnaire import QuestionnaireBase
from schema.text import TextBase


class ProcedureConfigBase(BaseModel):
    pass


class ProcedureConfigCreate(ProcedureConfigBase):
    study_id: int
    main: bool
    pass


class ProcedureConfig(ProcedureConfigBase):
    id: int
    study_id: int
    main: bool
    procedure_config_steps: List["ProcedureConfigStep"]

    class Config:
        from_attributes = True


class ProcedureConfigStep(BaseModel):
    id: int
    order: int
    counterbalance: bool

    procedure_config_id: int
    condition_id: Optional[int] = None
    text_id: Optional[int] = None
    questionnaire_id: Optional[int] = None
    pause_id: Optional[int] = None
    block_id: Optional[int] = None
    block: Optional[ProcedureConfig] = None

    class Config:
        from_attributes = True

# Procedure Config Block is similar do ProcedureConfig but without main field, and just added to avoid confusion

class ProcedureConfigBlockCreate(ProcedureConfigBase):
    study_id: int
    pass


class ProcedureConfigBlock(ProcedureConfigBase):
    id: int
    study_id: int
    procedure_config_steps: List[ProcedureConfigStep]

    class Config:
        from_attributes = True



class ProcedureConfigCreate(ProcedureConfigBase):
    study_id: int
    main: bool
    pass


class ProcedureConfigImport(ProcedureConfigBase):
    procedure_config_steps: List["ProcedureConfigStepImport"]

    class Config:
        from_attributes = True


class ProcedureConfigStepImport(BaseModel):
    order: Optional[int] = None
    counterbalance: bool

    condition: Optional[ConditionBase] = None
    text: Optional[TextBase] = None
    questionnaire: Optional[QuestionnaireBase] = None
    pause: Optional[PauseBase] = None
    block: Optional["ProcedureConfigImport"] = None

    class Config:
        from_attributes = True