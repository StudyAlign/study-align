from datetime import datetime, timedelta
from typing import Union

from fastapi import HTTPException
from sqlalchemy.orm import Session

import model

import schema.populated
import schema.pause
import schema.condition
import schema.questionnaire
import schema.text


def read_ordered_procedure_steps(db: Session, procedure_id: int):
    procedure_steps = db.query(model.ProcedureStep).\
        filter(model.ProcedureStep.procedure_id == procedure_id).\
        order_by(model.ProcedureStep.order.asc()).\
        all()
    return procedure_steps


def allows_config_to_proceed(participant: schema.populated.ParticipantPopulated, db: Session):
    procedure_step = participant.procedure_step
    if participant.procedure_step.pause is not None:
        pause_type = schema.pause.PauseTypeEnum(procedure_step.pause.type)
        current_step_config = participant.current_procedure_step_config
        if pause_type is schema.pause.PauseTypeEnum.controlled:
            if current_step_config.get("proceed"): # could also be "None"
                return True
        if pause_type is schema.pause.PauseTypeEnum.time_based:
            procedure_progress = db.query(model.ProcedureProgress). \
                filter(model.ProcedureProgress.state == "start_step"). \
                filter(model.ProcedureProgress.participant_id == participant.id). \
                filter(model.ProcedureProgress.procedure_step_id == participant.current_procedure_step). \
                one_or_none()
            procedure_progress_time = procedure_progress.time
            now = datetime.now()
            waiting_time = procedure_step.pause.config.get("waiting_time")
            return procedure_progress_time + timedelta(seconds=waiting_time) < now
        return False
    return True


def set_current_procedure_step_config(procedure_step: schema.populated.ProcedureStepPopulated,
                                      participant: schema.populated.ParticipantPopulated):
    if procedure_step.pause is not None:
        pause_type = schema.pause.PauseTypeEnum(procedure_step.pause.type)
        if pause_type is schema.pause.PauseTypeEnum.controlled:
            participant.current_procedure_step_config = {"proceed": False}
        if pause_type is schema.pause.PauseTypeEnum.time_based:
            participant.current_procedure_step_config = procedure_step.pause.config
        return participant

    participant.current_procedure_step_config = None
    return participant



def get_procedure_step(procedure_step: schema.populated.ProcedureStepPopulated):
    if procedure_step.condition is not None:
        return procedure_step.condition
    if procedure_step.text is not None:
        return procedure_step.text
    if procedure_step.questionnaire is not None:
        return procedure_step.questionnaire
    if procedure_step.pause is not None:
        return procedure_step.pause
    raise HTTPException(status_code=409, detail="Failed to get specific procedure step.")


def set_is_last_step(procedure_step: Union[schema.condition.ConditionStep,
                                 schema.questionnaire.QuestionnaireStep,
                                 schema.text.TextStep,
                                 schema.pause.PauseStep], is_last_step: bool):
    procedure_step.is_last_step = is_last_step
    return procedure_step


def set_is_second_last_step(procedure_step: Union[schema.condition.ConditionStep,
                                 schema.questionnaire.QuestionnaireStep,
                                 schema.text.TextStep,
                                 schema.pause.PauseStep], is_second_last_step: bool):
    procedure_step.is_second_last_step = is_second_last_step
    return procedure_step

