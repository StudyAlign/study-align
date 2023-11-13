from enum import Enum
from typing import Optional, Literal

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

    api_url: str
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
    api_credentials: Optional[str]

    class Config:
        extra = 'forbid'


class Questionnaire(QuestionnaireBase):
    id: int
    study_id: int

    class Config:
        from_attributes = True


class QuestionnaireStep(Questionnaire):
    procedure_step_type: str = Literal["questionnaire"]
    is_last_step: Optional[bool]
    is_second_last_step: Optional[bool]
