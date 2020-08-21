from datetime import datetime
from typing import Union

from pydantic import BaseModel


class PredictionBase(BaseModel):
    time: datetime
    input: Union[dict, list, set, float, int, str, bytes, bool]
    prediction: Union[dict, list, set, float, int, str, bytes, bool]


class PredictionCreate(PredictionBase):
    pass


class Prediction(PredictionBase):
    id: int

    ml_model_id: int
    participant_id: int
    condition_id: int

    class Config:
        orm_mode = True
