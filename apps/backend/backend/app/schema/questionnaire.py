from typing import Optional

from pydantic import BaseModel


class QuestionnaireBase(BaseModel):
    url: str
    results_url: str


class QuestionnaireCreate(QuestionnaireBase):
    study_id: int
    pass


class QuestionnairePatch(BaseModel):
    url: Optional[str]

    class Config:
        extra = 'forbid'


class Questionnaire(QuestionnaireBase):
    id: int
    study_id: Optional[int]

    class Config:
        orm_mode = True
