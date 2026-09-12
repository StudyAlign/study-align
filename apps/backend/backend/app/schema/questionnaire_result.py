import datetime
from typing import Union
from pydantic import BaseModel


class QuestionnaireResultBase(BaseModel):
    time: datetime.datetime
    result: Union[dict, list, set, float, int, str, bytes, bool]


class QuestionnaireResultCreate(QuestionnaireResultBase):
    participant_id: int
    questionnaire_id: int


class QuestionnaireResult(QuestionnaireResultBase):
    id: int
    participant_id: int
    questionnaire_id: int

    class Config:
        from_attributes = True
