from typing import List, Any, Optional, Union

from pydantic import BaseModel


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
    condition_id: Optional[int]
    text_id: Optional[int]
    questionnaire_id: Optional[int]
    pause_id: Optional[int]
    block_id: Optional[int]
    block: Optional[ProcedureConfig]

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