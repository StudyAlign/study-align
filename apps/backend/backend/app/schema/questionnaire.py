from enum import Enum
from typing import Optional, Literal

from pydantic import BaseModel, Json, Field

from schema.form import FormExport


class QuestionnaireSystemEnum(str, Enum):
    qualtrics = "qualtrics"
    surveymonkey = "surveymonkey"
    googleforms = "googleforms"
    typeform = "typeform"
    jotform = "jotform"
    limesurvey = "limesurvey"
    native = "native"


class QuestionnaireBase(BaseModel):
    url: Optional[str] = ""
    system: Optional[QuestionnaireSystemEnum]
    # For system == "native": the study-scoped Form rendered to participants
    # (managed by the backend) and the global source it was copied from.
    form_id: Optional[int] = None
    source_form_id: Optional[int] = None
    # The embedded form structure, so a native questionnaire travels with a study
    # export/duplicate and is recreated on import. Populated from the ORM `form`.
    form: Optional[FormExport] = None

    class Config:
        from_attributes = True


class QuestionnaireCreate(QuestionnaireBase):
    study_id: int


class QuestionnairePatch(BaseModel):
    url: Optional[str] = None
    system: Optional[QuestionnaireSystemEnum] = None
    form_id: Optional[int] = None
    source_form_id: Optional[int] = None

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
