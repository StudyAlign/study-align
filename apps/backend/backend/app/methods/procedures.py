from base64 import b64decode
from collections import deque
from typing import List, Union

from fastapi import HTTPException
import json
import schema
from sqlalchemy.orm import Session

import model

import methods.conditions

from schema.procedure import ProcedureCondition, ProcedureText, ProcedureQuestionnaire, ProcedurePause
from schema.procedure_progress import ProcedureProgressStateEnum, ProcedureProgressCreate
from schema.populated import ProcedureStepPopulated

from datetime import datetime


def read_procedure_ids_by_study(db: Session, study_id: int):
    procedure_ids = db.query(model.Procedure.id.label('id')). \
        filter(model.Procedure.study_id == study_id).\
        all()
    return procedure_ids


def create_procedures_with_steps(db: Session, study_id: int, steps: List[Union[ProcedureCondition,
                                                                               ProcedureText,
                                                                               ProcedureQuestionnaire,
                                                                               ProcedurePause]]):
    condition_ids = methods.conditions.read_condition_ids_by_study(db, study_id)
    latin_squared_ids = _latin_square(condition_ids)
    return _create_procedure_steps_bulk(db, study_id, steps, latin_squared_ids)


def _create_procedure_steps_bulk(db: Session,
                                 study_id: int,
                                 procedure_steps: List[Union[ProcedureCondition,
                                                             ProcedureText,
                                                             ProcedureQuestionnaire,
                                                             ProcedurePause]],
                                 latin_squared_ids: List[List[int]]):
    bulk_insert = []
    for i in range(len(latin_squared_ids)):
        # create procedure
        procedure = model.Procedure(study_id=study_id)
        db.add(procedure)
        db.flush()
        # create procedure_steps
        for k in range(len(procedure_steps)):
            procedure_step = model.ProcedureStep(procedure_id=procedure.id, order=k)
            if isinstance(procedure_steps[k], ProcedureCondition):
                procedure_step.condition_id = latin_squared_ids[i].pop(0)
            if isinstance(procedure_steps[k], ProcedureText):
                procedure_step.text_id = procedure_steps[k].text_id
            if isinstance(procedure_steps[k], ProcedureQuestionnaire):
                procedure_step.questionnaire_id = procedure_steps[k].questionnaire_id
            if isinstance(procedure_steps[k], ProcedurePause):
                procedure_step.pause_id = procedure_steps[k].pause_id
            bulk_insert.append(procedure_step)
    db.add_all(bulk_insert)
    return db.commit()


def _latin_square(condition_ids: List[int]):
    result = []
    conditions = deque(condition_ids)

    for x in range(len(condition_ids)):
        result.append(list(conditions))
        conditions.rotate(1)

    return result


def create_procedure_progress(db: Session, state: ProcedureProgressStateEnum, time: datetime, participant_id: int,
                              procedure_step_id: int):
    procedure_progress = ProcedureProgressCreate(
        state=state,
        time=time,
        participant_id=participant_id,
        procedure_step_id=procedure_step_id
    )
    db.add(model.ProcedureProgress(**procedure_progress.dict()))


def retrieve_survey_responses(db: Session, participant: schema.participant.Participant,
                              previous_step: schema.populated.ProcedureStepPopulated, time: datetime):
    # retrieve responses from external survey tools, such as limesurvey or monkeysurvey and move it into our DB
    if previous_step.questionnaire is not None:
        questionnaire_result_data = None

        if previous_step.questionnaire.system == schema.questionnaire.QuestionnaireSystemEnum.limesurvey:
            api_url = previous_step.questionnaire.api_url
            # LimeSurvey RPC class throws http errorparticipant_tokens
            limesurvey = methods.LimeSurvey(api_url, previous_step.questionnaire.api_username)
            limesurvey.get_session_key(previous_step.questionnaire.api_password)
            participant_token = limesurvey.format_participant_token(participant.token)
            participant_data = limesurvey.get_participant_properties(previous_step.questionnaire.ext_id,
                                                                     participant_token)
            if not participant_data or participant_data.get("completed") == "N":
                raise HTTPException(status_code=409,
                                    detail="Participant must have completed survey before you can proceed with the experiment.")

            questionnaire_result_data = limesurvey.export_responses_by_token(previous_step.questionnaire.ext_id,
                                                                             participant_token)
            limesurvey.release_session_key()

            if questionnaire_result_data:
                questionnaire_result_data = json.loads(b64decode(questionnaire_result_data))

        if not questionnaire_result_data:
            raise HTTPException(status_code=409,
                                detail="Questionnaire must be completed before you can proceed with the experiment.")

        questionnaire_result = schema.questionnaire_result.QuestionnaireResultCreate(
            time=time,
            result=questionnaire_result_data,
            questionnaire_id=previous_step.questionnaire.id,
            participant_id=participant.id
        )
        db.add(model.QuestionnaireResult(**questionnaire_result.dict()))