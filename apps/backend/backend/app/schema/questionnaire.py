from enum import Enum
from typing import Optional, Literal

from pydantic import BaseModel, Json, Field


class QuestionnaireSystemEnum(str, Enum):
    qualtrics = "qualtrics"
    surveymonkey = "surveymonkey"
    googleforms = "googleforms"
    typeform = "typeform"
    jotform = "jotform"
    limesurvey = "limesurvey"


class QuestionnaireBase(BaseModel):
    url: str
    system: Optional[QuestionnaireSystemEnum]

    class Config:
        from_attributes = True


class QuestionnaireCreate(QuestionnaireBase):
    study_id: int


class QuestionnairePatch(BaseModel):
    url: Optional[str] = None
    system: Optional[QuestionnaireSystemEnum] = None

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
