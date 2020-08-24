from datetime import datetime
from typing import Union

from pydantic import BaseModel


class PredictionBase(BaseModel):
    input: Union[dict, list, set, float, int, str, bytes, bool]


class PredictionInput(PredictionBase):
    pass


class PredictionCreate(PredictionBase):
    time: datetime
    prediction: Union[dict, list, set, float, int, str, bytes, bool]

    ml_model_id: int
    participant_id: int
    condition_id: int

class Prediction(PredictionBase):
    id: int
    time: datetime

    prediction: Union[dict, list, set, float, int, str, bytes, bool]

    ml_model_id: int
    participant_id: int
    condition_id: int

    class Config:
        orm_mode = True
