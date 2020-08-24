from datetime import datetime
from typing import List, Union

from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy import exc
from starlette import status

from model.base import Session
from api import get_db, if_exists

import requests

import model

import methods

import schema.condition
import schema.questionnaire
import schema.text
import schema.populated
import schema.procedure
import schema.procedure_progress
from schema.participant import ParticipantEnum
from schema.procedure_progress import ProcedureProgressStateEnum
import schema.questionnaire_result

router = APIRouter()

ENTITY = "Procedure"


@router.get("/procedures/start",
            response_model=Union[schema.condition.Condition,
                                 schema.questionnaire.Questionnaire,
                                 schema.text.Text])
async def procedure_start(participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant),
                          db: Session = Depends(get_db)):
    if participant.current_procedure_step is not None:
        raise HTTPException(status_code=409, detail="Procedure already started.")

    try:
        first_step = participant.procedure.procedure_steps[0]
        participant.current_procedure_step = first_step.id
        start_time = datetime.utcnow()
        progress_start_experiment = schema.procedure_progress.ProcedureProgressCreate(
            state=ProcedureProgressStateEnum.start_experiment,
            time=start_time,
            participant_id=participant.id,
            procedure_step_id=None
        )
        progress_start_step = schema.procedure_progress.ProcedureProgressCreate(
            state=ProcedureProgressStateEnum.start_step,
            time=start_time,
            participant_id=participant.id,
            procedure_step_id=first_step.id
        )
        db.add(model.ProcedureProgress(**progress_start_experiment.dict()))
        db.add(model.ProcedureProgress(**progress_start_step.dict()))
        db.commit()
        db.refresh(first_step)
    except exc.SQLAlchemyError as e:
        raise HTTPException(status_code=409, detail="Failed to start experiment.")

    return methods.get_procedure_step(first_step)


@router.get("/procedures/next",
            response_model=Union[schema.condition.Condition,
                                 schema.questionnaire.Questionnaire,
                                 schema.text.Text
            ])
async def procedure_next(participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant),
                         db: Session = Depends(get_db)):
    if participant.current_procedure_step is None:
        raise HTTPException(status_code=409, detail="Procedure not started yet.")

    try:
        next_time = datetime.utcnow()
        previous_step_id = participant.current_procedure_step
        progress_end_step = schema.procedure_progress.ProcedureProgressCreate(
            state=ProcedureProgressStateEnum.end_step,
            time=next_time,
            participant_id=participant.id,
            procedure_step_id=previous_step_id
        )
        previous_step = None
        for step in participant.procedure.procedure_steps:
            if step.id == previous_step_id:
                previous_step = step
                break
        previous_step_index = participant.procedure.procedure_steps.index(previous_step)

        #if previous step is a questionnaire, check if it is already finished by participant, persist it to DB accordingly
        if previous_step.questionnaire is not None:
            questionnaire_data = requests.get(previous_step.questionnaire.results_url)
            questionnaire_result_data = methods.check_questionnaire_results_soscisurvey(questionnaire_data, participant.token)

            if not questionnaire_result_data:
                raise HTTPException(status_code=409, detail="Questionnaire must be completed before you can proceed with the experiment.")

            questionnaire_result = schema.questionnaire_result.QuestionnaireResultCreate(
                time=next_time,
                result=questionnaire_result_data,
                questionnaire_id=previous_step.questionnaire.id,
                participant_id=participant.id
            )
            db.add(model.QuestionnaireResult(**questionnaire_result.dict()))

        # previous step is last step
        if previous_step_index == len(participant.procedure.procedure_steps) - 1:
            participant.current_procedure_step = None
            participant.state = ParticipantEnum.finished
            progress_end_experiment = schema.procedure_progress.ProcedureProgressCreate(
                state=ProcedureProgressStateEnum.end_experiment,
                time=next_time,
                participant_id=participant.id,
                procedure_step_id=None
            )
            db.add(model.ProcedureProgress(**progress_end_step.dict()))
            db.add(model.ProcedureProgress(**progress_end_experiment.dict()))
            db.commit()
            return

        next_step = participant.procedure.procedure_steps[previous_step_index + 1]
        participant.current_procedure_step = next_step.id
        progress_start_step = schema.procedure_progress.ProcedureProgressCreate(
            state=ProcedureProgressStateEnum.start_step,
            time=next_time,
            participant_id=participant.id,
            procedure_step_id=next_step.id
        )
        db.add(model.ProcedureProgress(**progress_end_step.dict()))
        db.add(model.ProcedureProgress(**progress_start_step.dict()))
        db.commit()
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to proceed experiment step.")
    return methods.get_procedure_step(next_step)


@router.get("/procedures/end", status_code=status.HTTP_204_NO_CONTENT)
async def procedure_end(participant: schema.participant.Participant = Depends(methods.get_active_participant),
                        db: Session = Depends(get_db)):
    if participant.current_procedure_step is None:
        raise HTTPException(status_code=409, detail="Procedure not started yet.")

    try:
        end_time = datetime.utcnow()
        previous_step_id = participant.current_procedure_step

        previous_step = None
        for step in participant.procedure.procedure_steps:
            if step.id == previous_step_id:
                previous_step = step
                break
        previous_step_index = participant.procedure.procedure_steps.index(previous_step)

        # previous step is last step
        if previous_step_index == len(participant.procedure.procedure_steps) - 1:
            participant.current_procedure_step = None
            participant.state = ParticipantEnum.finished
            progress_end_step = schema.procedure_progress.ProcedureProgressCreate(
                state=ProcedureProgressStateEnum.end_step,
                time=end_time,
                participant_id=participant.id,
                procedure_step_id=previous_step_id
            )
            progress_end_experiment = schema.procedure_progress.ProcedureProgressCreate(
                state=ProcedureProgressStateEnum.end_experiment,
                time=end_time,
                participant_id=participant.id,
                procedure_step_id=None
            )
            db.add(model.ProcedureProgress(**progress_end_step.dict()))
            db.add(model.ProcedureProgress(**progress_end_experiment.dict()))
            db.commit()
            return
        raise HTTPException(status_code=409, detail="Procedure not finished yet.")
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to end experiment.")



@router.get("/procedures/{procedure_id}", response_model=schema.populated.ProcedurePopulated,
            dependencies=[Depends(methods.switchAccessTokenValidator)])
async def read_procedure(procedure_id: int, db: Session = Depends(get_db)):
    procedure = methods.read(db, model.Procedure, procedure_id)
    if_exists(procedure, ENTITY)
    return procedure


@router.get("/procedures", response_model=List[schema.procedure.Procedure],
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_procedures_by_study_id(study_id: int, db: Session = Depends(get_db)):
    return methods.read_list_by(db, model.Procedure, "study_id", study_id)
