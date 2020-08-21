from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import exc
from sqlalchemy.orm import Session

import model
import schema.populated
import schema
from model.base import Base


def prepare_interaction_data(data: BaseModel, participant: schema.participant.Participant):
    interaction = data.interaction
    interaction_data = interaction.dict()
    interaction_data['study_id'] = participant.study_id
    interaction_data['participant_id'] = participant.id
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