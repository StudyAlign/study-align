from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import exc
from sqlalchemy.orm import Session

import model
import schema.populated
import schema
from model.base import Base


def read_interactions(db: Session, study_id: int, limit: int = 100):
    generic_interactions = db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).order_by(model.GenericInteraction.id.desc()).limit(limit).all()
    mouse_interactions = db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).order_by(model.MouseInteraction.id.desc()).limit(limit).all()
    keyboard_interactions = db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).order_by(model.KeyboardInteraction.id.desc()).limit(limit).all()
    drag_interactions = db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).order_by(model.DragInteraction.id.desc()).limit(limit).all()
    touch_interactions = db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).order_by(model.TouchInteraction.id.desc()).limit(limit).all()

    result = [] + generic_interactions + mouse_interactions + keyboard_interactions + drag_interactions + touch_interactions

    return sorted(result, key=lambda x: x.time, reverse=True)


def prepare_interaction_data(data: BaseModel, participant: schema.participant.Participant):
    interaction = data.interaction
    interaction_data = interaction.dict()
    interaction_data['study_id'] = participant.study_id
    interaction_data['participant_id'] = participant.id
    if hasattr(data, 'condition_id'):
        interaction_data['condition_id'] = data.condition_id
    return interaction_data


def create_single_interaction(db: Session, entity: str, model: Base, data: BaseModel, participant: schema.participant.Participant):
    try:
        interaction_data = prepare_interaction_data(data, participant)
        db_interaction_data = model(**interaction_data)
        db.add(db_interaction_data)
        db.commit()
        db.refresh(db_interaction_data)
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to log %s." % entity)
    return db_interaction_data


def create_bulk_interaction(db: Session, entity: str, model: Base, data: BaseModel, participant: schema.participant.Participant):
    try:
        interactions_bulk = []
        for interaction in data.interactions:
            interaction_data = interaction.dict()
            interaction_data['study_id'] = participant.study_id
            interaction_data['participant_id'] = participant.id
            interaction_data['condition_id'] = data.condition_id
            interactions_bulk.append(interaction_data)
        db.execute(model.__table__.insert(), interactions_bulk)
        db.commit()
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to log bulk of %s." % entity)
    return


def is_participating_in_condition(participant: schema.populated.ParticipantPopulated, condition_id: int):
    participates_condition = False
    for step in participant.procedure.procedure_steps:
        if step.condition and step.condition.id == condition_id:
            participates_condition = True
    if not participates_condition:
        raise HTTPException(status_code=403, detail="Not participating in condition.")