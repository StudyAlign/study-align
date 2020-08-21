from typing import List

from fastapi import HTTPException
from sqlalchemy.orm import Session

import model

import methods
from itertools import cycle
from api import if_not_zero, if_exists


def create_participants(db: Session, study_id: int, amount: int):
    procedure_ids = methods.read_procedure_ids_by_study(db, study_id)
    if_not_zero(procedure_ids, "Procedure")
    return _create_participants_bulk(db, study_id, amount, procedure_ids)


def _create_participants_bulk(db: Session, study_id: int, amount: int, procedure_ids: List[int]):
    bulk_insert = []
    procedure_cycle = cycle(procedure_ids)
    for i in range(amount):
        procedure_id = next(procedure_cycle)
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


def is_participant_allowed_to_use_model(db: Session, participant: model.Participant, machine_learning: model.MLModel):
    if participant:
        condition = methods.read(db, model.Condition, machine_learning.condition_id)
        if_exists(condition, "Condition")
        if participant.study_id != machine_learning.condition.study_id:
            raise HTTPException(status_code=403, detail="Participant is not allowed to use this model.")
