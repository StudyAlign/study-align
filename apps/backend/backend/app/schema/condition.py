import uuid
from typing import List, Optional, Union

from pydantic import BaseModel
from pydantic.fields import Field


class ConditionBase(BaseModel):
    name: str
    config: Union[dict, list, set, float, int, str, bytes, bool]
    url: str


class ConditionCreate(ConditionBase):
    study_id: int


class ConditionPatch(BaseModel):
    name: Optional[str]
    config: Optional[Union[dict, list, set, float, int, str, bytes, bool]]
    url: Optional[str]
    task_id: Optional[int]

    class Config:
        extra = 'forbid'


class Condition(ConditionBase):
    id: int
    uuid: uuid.UUID

    task_id: Optional[int]
    study_id: int

    #ml_model: Optional[MLModel]
    #interactions: List[Interaction] = []
    #predictions: List[Prediction] = []

    class Config:
        orm_mode = True


class ConditionStep(Condition):
    procedure_step_type: str = Field("condition", const=True)
