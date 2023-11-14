import uuid
from typing import List, Optional, Union, Literal

from pydantic import BaseModel
from pydantic.fields import Field


class ConditionBase(BaseModel):
    name: str
    config: Union[dict, list, set, float, int, str, bytes, bool]
    url: str


class ConditionCreate(ConditionBase):
    study_id: int


class ConditionPatch(BaseModel):
    name: Optional[str] = None
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None
    url: Optional[str] = None
    task_id: Optional[int] = None

    class Config:
        extra = 'forbid'


class Condition(ConditionBase):
    id: int
    uuid: uuid.UUID

    task_id: Optional[int] = None
    study_id: int

    #ml_model: Optional[MLModel]
    #interactions: List[Interaction] = []
    #predictions: List[Prediction] = []

    class Config:
        from_attributes = True


class ConditionStep(Condition):
    procedure_step_type: Literal["condition"] = "condition"
    is_last_step: Optional[bool] = None
    is_second_last_step: Optional[bool] = None


class ConditionConfig(BaseModel):
    id: int
    config: Union[dict, list, set, float, int, str, bytes, bool]

    class Config:
        from_attributes = True
