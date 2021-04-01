from enum import Enum
import uuid
from typing import Optional
from pydantic import BaseModel


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

    current_procedure_step: Optional[int] = None

    class Config:
        orm_mode = True
