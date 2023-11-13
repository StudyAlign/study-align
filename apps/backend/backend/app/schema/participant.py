from enum import Enum
import uuid
from typing import Optional, Union
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
    current_procedure_step_config: Optional[Union[dict, list, set, float, int, str, bytes, bool]] = None

    logger_key: uuid.UUID

    class Config:
        from_attributes = True
