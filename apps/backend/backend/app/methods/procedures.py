from base64 import b64decode
from collections import deque
from typing import List, Union, Dict

from fastapi import HTTPException
import json
import schema
from sqlalchemy.orm import Session

import model

import methods.conditions
from api import if_exists
from model import ProcedureStep

from schema.procedure import ProcedureCondition, ProcedureText, ProcedureQuestionnaire, ProcedurePause
from schema.procedure_config import ProcedureConfigStep
from schema.procedure_progress import ProcedureProgressStateEnum, ProcedureProgressCreate
from schema.populated import ProcedureStepPopulated

from datetime import datetime


def read_procedure_ids_by_study(db: Session, study_id: int):
    procedure_ids = db.query(model.Procedure.id.label('id')). \
        filter(model.Procedure.study_id == study_id).\
        all()
    return procedure_ids


def create_procedures_with_steps(db: Session, study_id: int):
    # get the main procedure config
    procedure_config_main = methods.read_by_dict(db, model.ProcedureConfig, {"study_id": study_id, "main": True})
    if_exists(procedure_config_main, "ProcedureConfig")

    # read ids of counter balanced config steps (only the first level, i.e. where procedure config id is the main config)
    counter_balanced_config_step_ids = methods.procedure_configs.read_procedure_config_step_ids_by_config_main_id(db, procedure_config_main.id)
    # get a list of all counter_balanced steps on level 0, i.e. where procedure config id is the main id
    counter_balanced_steps = methods.read_list_by_dict(db, model.ProcedureConfigStep, {"procedure_config_id": procedure_config_main.id, "counterbalance": True})
    counter_balanced_steps = {cbs.id:cbs for cbs in counter_balanced_steps} # create dict
    # build latin square of ids
    # TODO: also implement balanced latin square
    latin_squared_ids = _latin_square(counter_balanced_config_step_ids)

    return _create_procedure_steps_bulk(db, study_id, procedure_config_main.procedure_config_steps, latin_squared_ids, counter_balanced_steps)


def _latin_square(counter_balanced_config_step_ids: List[int]):
    result = []
    procedure_config_steps = deque(counter_balanced_config_step_ids)

    if not counter_balanced_config_step_ids:
        procedure_config_steps = [1]

    for x in range(len(counter_balanced_config_step_ids)):
        result.append(list(procedure_config_steps))
        procedure_config_steps.rotate(1)

    return result


def _create_procedure_steps_bulk(db: Session,
                                 study_id: int,
                                 config_steps: List[ProcedureConfigStep],
                                 latin_squared_ids: List[List[int]],
                                 counter_balanced_steps: Dict[int, ProcedureConfigStep]):
    bulk_insert_all = []
    # if no counter balanced steps, just add the procedure
    if not latin_squared_ids:
        # create procedure
        procedure = model.Procedure(study_id=study_id)
        db.add(procedure)
        db.flush()

        # generate steps for procedure
        bulk_insert = []
        bulk_insert = _add_procedure_step(bulk_insert, procedure.id, config_steps, [],
                                          counter_balanced_steps)

        # append procedure steps to list of all steps
        bulk_insert_all.extend(bulk_insert)
    else:
        # iterate on all possible latin squares (counter balanced procedures)
        for i in range(len(latin_squared_ids)):
            # create procedure
            procedure = model.Procedure(study_id=study_id)
            db.add(procedure)
            db.flush()

            # generate steps for procedure
            bulk_insert = []
            bulk_insert = _add_procedure_step(bulk_insert, procedure.id, config_steps, latin_squared_ids[i], counter_balanced_steps)

            # append procedure steps to list of all steps
            bulk_insert_all.extend(bulk_insert)

    db.add_all(bulk_insert_all)
    return db.commit()

def _add_procedure_step(bulk_insert: List,
                        procedure_id: int,
                        config_steps: List[ProcedureConfigStep],
                        latin_squared_ids: List[int],
                        counter_balanced_steps: Dict[int, ProcedureConfigStep],
                        level: int = 0):
    # iterate config steps
    for k in range(len(config_steps)):
        procedure_step = model.ProcedureStep(procedure_id=procedure_id, order=len(bulk_insert))
        config_step = config_steps[k]
        # only look for counter balancing on the main level (level 0)
        if level == 0 and config_step.counterbalance:
            # get the step counterbalanced steps from latin square list
            counter_balanced_step_id = latin_squared_ids.pop(0)
            counterbalanced_step = counter_balanced_steps[counter_balanced_step_id]
            if not counterbalanced_step.block_id is None:
                # a block has been set for counter balancing, add the block steps
                # counterbalanced_step.block is a ProcedureConfig with procedure_config_steps, i.e. block steps
                bulk_insert = _add_procedure_step(bulk_insert, procedure_id, counterbalanced_step.block.procedure_config_steps, latin_squared_ids, counter_balanced_steps, level + 1)
            else:
                # add counterbalanced step
                bulk_insert = _add_element_to_procedure_step(bulk_insert, procedure_step, counterbalanced_step)
        else:
            if not config_step.block_id is None:
                # config step is a block, add the block steps
                bulk_insert = _add_procedure_step(bulk_insert, procedure_id, config_step.block.procedure_config_steps, latin_squared_ids, counter_balanced_steps, level + 1)
            else:
                # add regular step
                bulk_insert = _add_element_to_procedure_step(bulk_insert, procedure_step, config_step)
    return bulk_insert


def _add_element_to_procedure_step(bulk_insert: List, procedure_step: ProcedureStep, config_step: ProcedureConfigStep):
    if not config_step.condition_id is None:
        procedure_step.condition_id = config_step.condition_id
    if not config_step.text_id is None:
        procedure_step.text_id = config_step.text_id
    if not config_step.questionnaire_id is None:
        procedure_step.questionnaire_id = config_step.questionnaire_id
    if not config_step.pause_id is None:
        procedure_step.pause_id = config_step.pause_id
    bulk_insert.append(procedure_step)
    return bulk_insert


def create_procedures_with_steps_old(db: Session, study_id: int, steps: List[Union[ProcedureCondition,
                                                                               ProcedureText,
                                                                               ProcedureQuestionnaire,
                                                                               ProcedurePause]]):
    condition_ids = methods.conditions.read_condition_ids_by_study(db, study_id)
    for i in range(len(steps)):
        # remove static conditions from counterblanacing
        if isinstance(steps[i], ProcedureCondition) and steps[i].dummy is False:
            condition_ids.remove(steps[i].condition_id)
    latin_squared_ids = _latin_square_old(condition_ids)
    return _create_procedure_steps_bulk_old(db, study_id, steps, latin_squared_ids)


def _create_procedure_steps_bulk_old(db: Session,
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
                if procedure_steps[k].dummy is False:
                    procedure_step.condition_id = procedure_steps[k].condition_id
                else:
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


def _latin_square_old(condition_ids: List[int]):
    result = []
    conditions = deque(condition_ids)

    if not condition_ids:
        condition_ids = [1]

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

# DEPRECATED! Only here for legacy documentation
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