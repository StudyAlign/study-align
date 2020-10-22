import asyncio
import json
from base64 import b64decode
from datetime import datetime
from typing import List, Union

from fastapi import Depends, APIRouter, HTTPException, Request
from sqlalchemy import exc
from sse_starlette.sse import EventSourceResponse
from starlette import status

from methods.procedure_navigator import ProcedureNavigator, navigator_sse
from model.base import Session
from api import get_db, if_exists


import model

import methods

import schema.condition
import schema.questionnaire
import schema.text
import schema.populated
import schema.procedure
import schema.procedure_progress
import schema.procedure_navigator
from schema.participant import ParticipantEnum
from schema.procedure_progress import ProcedureProgressStateEnum
import schema.questionnaire_result


router = APIRouter()

ENTITY = "Procedure"

navigator = ProcedureNavigator()


@router.get("/procedures/start",
            response_model=Union[schema.condition.ConditionStep,
                                 schema.questionnaire.QuestionnaireStep,
                                 schema.text.TextStep])
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
        #methods.create_procedure_progress(db=db, state=ProcedureProgressStateEnum.start_step, time=start_time,
        #                                  participant_id=participant.id, procedure_step_id=first_step.id)
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
            response_model=Union[schema.condition.ConditionStep,
                                 schema.questionnaire.QuestionnaireStep,
                                 schema.text.TextStep])
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

        # retrieve responses from external survey tools, such as limesurvey or monkeysurvey and move it into our DB
        if previous_step.questionnaire is not None:
            questionnaire_result_data = None

            if previous_step.questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
                api_url = previous_step.questionnaire.api_url
                # LimeSurvey RPC class throws http errors
                limesurvey = methods.LimeSurvey(api_url, previous_step.questionnaire.api_username)
                limesurvey.get_session_key(previous_step.questionnaire.api_password)

                participant_data = limesurvey.get_participant_properties(previous_step.questionnaire.ext_id,
                                                                         participant.token)
                if not participant_data or participant_data.get("completed") == "N":
                    raise HTTPException(status_code=409,
                                        detail="Participant must have completed survey before you can proceed with the experiment.")

                questionnaire_result_data = limesurvey.export_responses_by_token(previous_step.questionnaire.ext_id,
                                                                                 participant.token)
                limesurvey.release_session_key()

                if questionnaire_result_data:
                    questionnaire_result_data = json.loads(b64decode(questionnaire_result_data))

            if not questionnaire_result_data:
                raise HTTPException(status_code=409,
                                    detail="Questionnaire must be completed before you can proceed with the experiment.")

            questionnaire_result = schema.questionnaire_result.QuestionnaireResultCreate(
                time=next_time,
                result=questionnaire_result_data,
                questionnaire_id=previous_step.questionnaire.id,
                participant_id=participant.id
            )
            db.add(model.QuestionnaireResult(**questionnaire_result.dict()))
            navigator.unsubscribe(participant.id)

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
            navigator.unsubscribe(participant.id)
            raise HTTPException(status_code=405,
                                detail="study finished")


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

        # subscribe to SSE if next step is a limesurvey questionnaire
        if next_step.questionnaire and next_step.questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
            print("SUBSCRIBED TO SSE")
            navigator.subscribe(participant_id=participant.id, procedure_step_id=next_step.id,
                            state=schema.procedure_navigator.ProcedureNavigatorStateEnum.in_progress)

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
            navigator.unsubscribe(participant.id)
            return
        raise HTTPException(status_code=409, detail="Procedure not finished yet.")
    except exc.SQLAlchemyError:
        raise HTTPException(status_code=409, detail="Failed to end experiment.")


@router.get("/procedures/check-survey-result", status_code=status.HTTP_204_NO_CONTENT)
async def procedure_check_surveyresult(participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant)):
    current_step = participant.procedure_step
    if current_step and current_step.questionnaire:
        if current_step.questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
            api_url = current_step.questionnaire.api_url
            # LimeSurvey RPC class throws http errors
            limesurvey = methods.LimeSurvey(api_url, current_step.questionnaire.api_username)
            limesurvey.get_session_key(current_step.questionnaire.api_password)

            participant_data = limesurvey.get_participant_properties(current_step.questionnaire.ext_id,
                                                                     participant.token)
            limesurvey.release_session_key()
            print(participant_data)
            if not participant_data or participant_data.get("completed") == "N":
                raise HTTPException(status_code=409,
                                    detail="Participant must have completed survey before you can proceed with the experiment.")
            return
        raise HTTPException(status_code=409, detail="Current step is not a limesurvey.")
    raise HTTPException(status_code=409, detail="Current step is not a questionnaire.")


@router.get("/procedures/navigator")
async def navigate_procedure(request: Request,
                             participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant)):
    sse = navigator_sse(request, navigator, participant.id)
    return EventSourceResponse(sse)


@router.get("/procedures/navigator/reconnect", status_code=status.HTTP_204_NO_CONTENT)
async def reconnect_procedure_navigator(participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant)):
    questionnaire = participant.procedure_step.questionnaire
    if questionnaire and questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
        connection = navigator.get_connection(participant.id)
        if not connection:
            current_step = participant.procedure_step
            api_url = current_step.questionnaire.api_url
            # LimeSurvey RPC class throws http errors
            limesurvey = methods.LimeSurvey(api_url, current_step.questionnaire.api_username)
            limesurvey.get_session_key(current_step.questionnaire.api_password)
            participant_data = limesurvey.get_participant_properties(current_step.questionnaire.ext_id,
                                                                     participant.token)
            limesurvey.release_session_key()
            state = schema.procedure_navigator.ProcedureNavigatorStateEnum.in_progress
            if not participant_data or participant_data.get("completed") != "N":
                state = schema.procedure_navigator.ProcedureNavigatorStateEnum.done

            navigator.subscribe(participant_id=participant.id,
                                procedure_step_id=participant.current_procedure_step,
                                state=state)
            return
        raise HTTPException(status_code=409, detail="Participant is already subscribed.")
    raise HTTPException(status_code=409, detail="Navigator reconnect failed, current step is not a questionnaire.")


# External systems call this method to change state
@router.post("/procedures/navigator", status_code=status.HTTP_204_NO_CONTENT)
async def update_procedure_navigator(connection_update: schema.procedure_navigator.ProcedureNavigatorConnectionUpdate,
                                     db: Session = Depends(get_db)):
    participant = methods.read_by(db, model.Participant, "token", connection_update.participant_token)
    if_exists(participant, "Participant")

    questionnaire = participant.procedure_step.questionnaire
    print(questionnaire)
    # check if the current step is a limesurvey questionnaire
    if questionnaire and questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
        # check if the state update aims for the current limesurvey questionnaire
        if questionnaire.system == connection_update.source and questionnaire.ext_id == connection_update.ext_id:
            navigator.update_connection(participant_id=participant.id,
                                        procedure_step_id=participant.current_procedure_step,
                                        state=connection_update.state)
            return
    raise HTTPException(status_code=409, detail="Navigator state change failed.")


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