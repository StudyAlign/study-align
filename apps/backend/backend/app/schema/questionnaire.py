from enum import Enum
from typing import Optional

from pydantic import BaseModel, Json, Field


class QuestionnaireSystemEnum(str, Enum):
    limesurvey = "limesurvey"
    soscisurvey = "soscisurvey"
    surveymonkey = "surveymonkey"


class QuestionnaireBase(BaseModel):
    url: str
    system: QuestionnaireSystemEnum


class QuestionnaireCreate(QuestionnaireBase):
    study_id: int
    ext_id: str

    api_username: str
    api_password: str


class QuestionnaireRemoteControl(QuestionnaireBase):
    study_id: int
    api_url: Optional[str]
    api_username: Optional[str]
    api_password: Optional[str]

    credentials: Optional[Json[dict]]


class QuestionnairePatch(BaseModel):
    url: Optional[str]
    system: Optional[QuestionnaireSystemEnum]

    ext_id: Optional[str]

    api_url: Optional[str]
    api_username: Optional[str]
    api_password: Optional[str]

    class Config:
        extra = 'forbid'


class Questionnaire(QuestionnaireBase):
    id: int
    study_id: Optional[int]

    class Config:
        orm_mode = True


class QuestionnaireStep(Questionnaire):
    procedure_step_type: str = Field("questionnaire", const=True)
