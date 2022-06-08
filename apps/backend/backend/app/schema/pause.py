from typing import Optional, Union
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
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]]


class PauseCreate(PauseBase):
    study_id: int
    pass


class PausePatch(BaseModel):
    title: Optional[str]
    body: Optional[str]
    proceed_body: Optional[str]
    type: Optional[PauseTypeEnum]
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]]

    class Config:
        extra = 'forbid'


class Pause(PauseBase):
    id: int
    study_id: int

    class Config:
        orm_mode = True


class PauseStep(Pause):
    procedure_step_type: str = Field("pause", const=True)
    is_last_step: Optional[bool]
    is_second_last_step: Optional[bool]