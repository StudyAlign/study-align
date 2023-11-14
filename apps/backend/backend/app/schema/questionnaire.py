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
    api_url: Optional[str] = None
    api_username: Optional[str] = None
    api_password: Optional[str] = None

    credentials: Optional[Json[dict]] = None


class QuestionnairePatch(BaseModel):
    url: Optional[str] = None
    system: Optional[QuestionnaireSystemEnum] = None

    ext_id: Optional[str] = None

    api_url: Optional[str] = None
    api_username: Optional[str] = None
    api_password: Optional[str] = None
    api_credentials: Optional[str] = None

    class Config:
        extra = 'forbid'


class Questionnaire(QuestionnaireBase):
    id: int
    study_id: int

    class Config:
        from_attributes = True


class QuestionnaireStep(Questionnaire):
    procedure_step_type: Literal["questionnaire"] = "questionnaire"
    is_last_step: Optional[bool] = None
    is_second_last_step: Optional[bool] = None
