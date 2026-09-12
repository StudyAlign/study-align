from typing import Optional, Union, Literal
from enum import Enum

from pydantic import BaseModel, Field


class PauseTypeEnum(str, Enum):
    time_based = "time_based"
    controlled = "controlled"


class PauseBase(BaseModel):
    title: str
    body: str
    proceed_body: str
    type: PauseTypeEnum
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None

    class Config:
        from_attributes = True


class PauseCreate(PauseBase):
    study_id: int
    pass


class PausePatch(BaseModel):
    title: Optional[str] = None
    body: Optional[str] = None
    proceed_body: Optional[str] = None
    type: Optional[PauseTypeEnum] = None
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None

    class Config:
        extra = 'forbid'


class Pause(PauseBase):
    id: int
    study_id: int

    class Config:
        from_attributes = True


class PauseStep(Pause):
    procedure_step_type: Literal["pause"] = "pause"
    is_last_step: Optional[bool] = None
    is_second_last_step: Optional[bool] = None