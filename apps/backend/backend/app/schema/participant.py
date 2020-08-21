from enum import Enum
import uuid
from typing import List, Optional
from pydantic import BaseModel

from schema.questionnaire_result import QuestionnaireResult
from schema.machine_learning.prediction import Prediction


class ParticipantEnum(str, Enum):
    free = "free"
    in_progress = "in_progress"
    finished = "finished"


class ParticipantBase(BaseModel):
    state: ParticipantEnum
    study_id: int


class ParticipantCreate(ParticipantBase):
    pass


class Participant(ParticipantBase):
    id: int
    token: uuid.UUID
    timezone: Optional[str] = None

    procedure_id: Optional[int] = None

    procedure_step_id: Optional[int] = None

    class Config:
        orm_mode = True
