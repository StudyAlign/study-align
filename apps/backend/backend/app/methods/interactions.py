import csv
import io
from typing import Union, Literal

from fastapi import HTTPException
from pydantic import BaseModel
from sqlalchemy import exc
from sqlalchemy.orm import Session

import model
import schema.populated
import schema
from model.base import Base
from schema.interaction.interactions import InteractionEnum, InteractionOrderByFields


def read_interactions(db: Session, study_id: int, type: InteractionEnum, offset: int = 0, limit: int = 100,
                      order_by: InteractionOrderByFields = "id", direction: Literal["asc", "desc"] = "asc"):
    result = []
    if type == InteractionEnum.all:
        generic_interactions = db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).order_by(order_query(model.GenericInteraction, order_by, direction)).limit(limit).all()
        mouse_interactions = db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).order_by(order_query(model.MouseInteraction, order_by, direction)).limit(limit).all()
        keyboard_interactions = db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).order_by(order_query(model.KeyboardInteraction, order_by, direction)).limit(limit).all()
        drag_interactions = db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).order_by(order_query(model.DragInteraction, order_by, direction)).limit(limit).all()
        touch_interactions = db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).order_by(order_query(model.TouchInteraction, order_by, direction)).limit(limit).all()
        result = result + generic_interactions + mouse_interactions + keyboard_interactions + drag_interactions + touch_interactions
    elif type == InteractionEnum.generic:
        generic_interactions = db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).order_by(order_query(model.GenericInteraction, order_by, direction)).offset(offset).limit(limit).all()
        result = result + generic_interactions
    elif type == InteractionEnum.mouse:
        mouse_interactions = db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).order_by(order_query(model.MouseInteraction, order_by, direction)).offset(offset).limit(limit).all()
        result = result + mouse_interactions
    elif type == InteractionEnum.keyboard:
        keyboard_interactions = db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).order_by(order_query(model.KeyboardInteraction, order_by, direction)).offset(offset).limit(limit).all()
        result = result + keyboard_interactions
    elif type ==InteractionEnum.drag:
        drag_interactions = db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).order_by(order_query(model.DragInteraction, order_by, direction)).offset(offset).limit(limit).all()
        result = result + drag_interactions
    elif type ==InteractionEnum.touch:
        touch_interactions = db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).order_by(order_query(model.TouchInteraction, order_by, direction)).offset(offset).limit(limit).all()
        result = result + touch_interactions
    #return sorted(result, key=lambda x: x.time, reverse=True)
    return result


def order_query(query_model: Union[model.GenericInteraction, model.KeyboardInteraction, model.MouseInteraction, model.DragInteraction, model.TouchInteraction], order: InteractionOrderByFields, direction: Literal["asc", "desc"]):
    if direction == "asc":
        return query_model.__table__.c[order].asc()
    return query_model.__table__.c[order].desc()


def export_interaction(db: Session, study_id: int, type: InteractionEnum):
    if type == InteractionEnum.generic:
        return db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).order_by(model.GenericInteraction.id.asc()).all()
    elif type == InteractionEnum.mouse:
        return db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).order_by(model.MouseInteraction.id.asc()).all()
    elif type == InteractionEnum.keyboard:
        return db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).order_by(model.KeyboardInteraction.id.asc()).all()
    elif type ==InteractionEnum.drag:
        return db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).order_by(model.DragInteraction.id.asc()).all()
    elif type ==InteractionEnum.touch:
        return db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).order_by(model.TouchInteraction.id.asc()).all()


def get_keys(type: InteractionEnum):
    if type == InteractionEnum.generic:
        return [column.key for column in model.GenericInteraction.__table__.columns]
    elif type == InteractionEnum.mouse:
        return [column.key for column in model.MouseInteraction.__table__.columns]
    elif type == InteractionEnum.keyboard:
        return [column.key for column in model.KeyboardInteraction.__table__.columns]
    elif type ==InteractionEnum.drag:
        return [column.key for column in model.DragInteraction.__table__.columns]
    elif type ==InteractionEnum.touch:
        return [column.key for column in model.TouchInteraction.__table__.columns]

def create_csv(keys, rows):
    s = io.StringIO()
    try:
        writer = csv.writer(s, delimiter='\t')
        writer.writerow(keys)
        for row in rows:
            writer.writerow(row.to_csv_row())
        s.seek(0)
        return s.getvalue().encode('utf-16')
    except:
        raise HTTPException(detail='There was an error processing the data', status_code=400)
    finally:
        s.close()


def interaction_count(db: Session, study_id: int, type: InteractionEnum):
    if type == InteractionEnum.generic:
        return db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).count()
    elif type == InteractionEnum.mouse:
        return db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).count()
    elif type == InteractionEnum.keyboard:
        return db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).count()
    elif type ==InteractionEnum.drag:
        return db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).count()
    elif type ==InteractionEnum.touch:
        return db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).count()


def interaction_counts(db: Session, study_id: int):
    return {
        "generic": db.query(model.GenericInteraction).filter(model.GenericInteraction.study_id == study_id).count(),
        "mouse": db.query(model.MouseInteraction).filter(model.MouseInteraction.study_id == study_id).count(),
        "keyboard": db.query(model.KeyboardInteraction).filter(model.KeyboardInteraction.study_id == study_id).count(),
        "drag": db.query(model.DragInteraction).filter(model.DragInteraction.study_id == study_id).count(),
        "touch": db.query(model.TouchInteraction).filter(model.TouchInteraction.study_id == study_id).count()
    }


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