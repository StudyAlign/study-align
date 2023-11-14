from typing import List
from uuid import UUID

from fastapi import HTTPException
from sqlalchemy import Boolean, cast, JSON, not_
from sqlalchemy.orm import Session, joinedload

import model

import methods
from itertools import cycle
from api import if_not_zero, if_exists
from schema.participant import ParticipantEnum
from schema.pause import PauseTypeEnum


def read_participants_with_filters(db: Session, study_id: int,
                                   participant_state: ParticipantEnum,
                                   paused: bool,
                                   proceed: bool):
    participants = db.query(model.Participant).filter(model.Participant.study_id == study_id)
    if participant_state:
        participants = participants.filter(model.Participant.state == participant_state)
    if paused:
        participants = participants.join(model.ProcedureStep).join(model.Pause)
        if proceed:
            participants = participants.filter(model.Participant.current_procedure_step_config['proceed'].astext.cast(Boolean).is_(True))
    return participants.all()


def create_participants(db: Session, study_id: int, amount: int):
    procedure_ids = methods.read_procedure_ids_by_study(db, study_id)
    if_not_zero(procedure_ids, "Procedure")
    print(procedure_ids)
    return _create_participants_bulk(db, study_id, amount, procedure_ids)


def _create_participants_bulk(db: Session, study_id: int, amount: int, procedure_ids: List[int]):
    bulk_insert = []
    procedure_cycle = cycle(procedure_ids)
    for i in range(amount):
        procedure_id = next(procedure_cycle)
        procedure_id = procedure_id[0]
        participant = model.Participant(study_id=study_id, procedure_id=procedure_id, state="free")
        bulk_insert.append(participant)
    db.add_all(bulk_insert)
    return db.commit()


def draw_participant(db: Session, study_id: int):
    participant = db.query(model.Participant). \
        filter(model.Participant.study_id == study_id). \
        filter(model.Participant.state == "free"). \
        order_by(model.Participant.id.asc()). \
        first()

    if not participant:
        return None

    participant.state = "in_progress"
    db.commit()
    return participant


def read_participant_by_token(study_id: int, participant_token: UUID, db: Session):
    participant = db.query(model.Participant). \
        filter(model.Participant.study_id == study_id). \
        filter(model.Participant.token == participant_token). \
        one_or_none()
    return participant


def is_participant_allowed_to_use_model(db: Session, participant: model.Participant, machine_learning: model.MLModel):
    if participant:
        condition = methods.read(db, model.Condition, machine_learning.condition_id)
        if_exists(condition, "Condition")
        if participant.study_id != machine_learning.condition.study_id:
            raise HTTPException(status_code=403, detail="Participant is not allowed to use this model.")
