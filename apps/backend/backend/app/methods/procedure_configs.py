from base64 import b64decode
from collections import deque
from typing import List, Union, Optional

from fastapi import HTTPException
import json
import schema
from sqlalchemy.orm import Session

import model

import methods.conditions
from api import if_exists

from schema.procedure import ProcedureCondition, ProcedureText, ProcedureQuestionnaire, ProcedurePause
from schema.procedure_progress import ProcedureProgressStateEnum, ProcedureProgressCreate
from schema.populated import ProcedureStepPopulated
from schema.procedure_config_step import ProcedureConfigCreateAllSteps, ProcedureConfigStepCondition, \
    ProcedureConfigStepText, ProcedureConfigStepQuestionnaire, ProcedureConfigStepPause, ProcedureConfigStepBlock, \
    ProcedureConfigSteps, ProcedureConfigUpdateAllSteps, ProcedureConfigStepPatch, \
    ProcedureConfigCreateSingleStep, ProcedureConfigStepBlockSingle

from datetime import datetime


def read_procedure_configs_ids_by_study(db: Session, study_id: int):
    procedure_ids = db.query(model.Procedure.id.label('id')). \
        filter(model.Procedure.study_id == study_id).\
        all()
    return procedure_ids


def read_procedure_config_step_ids_by_config_main_id(db: Session, procedure_config_main_id: int):
    procedure_config_step_ids = db.query(model.ProcedureConfigStep.id.label('id')). \
        filter(
            model.ProcedureConfigStep.procedure_config_id == procedure_config_main_id,
            model.ProcedureConfigStep.counterbalance == True
        ).\
        all()
    result = [procedure_config_step_id for procedure_config_step_id, in procedure_config_step_ids]
    return result


def check_if_config_step_exists(db, model, id, entity):
    config_step = methods.read(db, model, id)
    if_exists(config_step, entity)

# Initial creation of a single config step.

def create_procedure_config_step(db: Session, procedure_config_id: int, step: ProcedureConfigCreateSingleStep):
    procedure_config_step = _create_procedure_config_step(db, procedure_config_id, step)
    return methods.create(db, model.ProcedureConfigStep, procedure_config_step)

# Initial creation of all config steps provided.

def create_procedure_config_steps(db: Session, procedure_config_id: int, steps: ProcedureConfigCreateAllSteps):
    bulk_insert = []
    bulk_insert = _iterate_procedure_config_steps(db, bulk_insert, procedure_config_id, steps.procedure_config_steps)
    #print(bulk_insert)
    db.add_all(bulk_insert)
    return db.commit()


def _iterate_procedure_config_steps(db: Session, bulk_insert: List, procedure_config_id: int, steps: ProcedureConfigSteps):
    for i in range(len(steps)):
        bulk_insert = _create_procedure_config_steps_bulk(db, bulk_insert, procedure_config_id, i, steps[i])
    return bulk_insert


def _create_procedure_config_steps_bulk(db: Session, bulk_insert: Optional[List], procedure_config_id: int, order: int, step: Union[ProcedureConfigStepCondition,
ProcedureConfigStepText,
ProcedureConfigStepQuestionnaire,
ProcedureConfigStepPause,
ProcedureConfigStepBlock]):
    procedure_config_step = model.ProcedureConfigStep(procedure_config_id=procedure_config_id, order=order, counterbalance=step.counterbalance)
    if isinstance(step, ProcedureConfigStepCondition):
        check_if_config_step_exists(db, model.Condition, step.condition_id, "Condition")
        procedure_config_step.condition_id = step.condition_id
    if isinstance(step, ProcedureConfigStepText):
        check_if_config_step_exists(db, model.Text, step.text_id, "Text")
        procedure_config_step.text_id = step.text_id
    if isinstance(step, ProcedureConfigStepQuestionnaire):
        check_if_config_step_exists(db, model.Questionnaire, step.questionnaire_id, "Questionnaire")
        procedure_config_step.questionnaire_id = step.questionnaire_id
    if isinstance(step, ProcedureConfigStepPause):
        check_if_config_step_exists(db, model.Pause, step.pause_id, "Pause")
        procedure_config_step.pause_id = step.pause_id
    if isinstance(step, ProcedureConfigStepBlock):
        check_if_config_step_exists(db, model.ProcedureConfig, step.block_id, "ProcedureConfig")
        procedure_config_step.block_id = step.block_id
        bulk_insert = _iterate_procedure_config_steps(db, bulk_insert, step.block_id, step.block)
    bulk_insert.append(procedure_config_step)
    return bulk_insert



# Only create a single procedure config step. This needs to be done, to insert steps after the config has been initialized.
# After that, config step order needs to be updated.
def _create_procedure_config_step(db: Session, procedure_config_id: int, step: ProcedureConfigCreateSingleStep):
    step = step.model_dump()
    step["procedure_config_id"] = procedure_config_id
    if isinstance(step, ProcedureConfigStepCondition):
        check_if_config_step_exists(db, model.Condition, step.condition_id, "Condition")
    if isinstance(step, ProcedureConfigStepText):
        check_if_config_step_exists(db, model.Text, step.text_id, "Text")
    if isinstance(step, ProcedureConfigStepQuestionnaire):
        check_if_config_step_exists(db, model.Questionnaire, step.questionnaire_id, "Questionnaire")
    if isinstance(step, ProcedureConfigStepPause):
        check_if_config_step_exists(db, model.Pause, step.pause_id, "Pause")
    if isinstance(step, ProcedureConfigStepBlockSingle):
        check_if_config_step_exists(db, model.ProcedureConfig, step.block_id, "ProcedureConfig")
    return step


# Update the list of procedure config steps. Change the order and counterbalancing.
def update_procedure_config_steps(db: Session, procedure_config_id: int, steps: ProcedureConfigUpdateAllSteps):
    bulk_update = []
    bulk_update = _iterate_procedure_config_update(db, bulk_update, procedure_config_id, steps.procedure_config_steps)
    updated_config_steps = methods.patch_all(db, model.ProcedureConfigStep, bulk_update)
    return


def _iterate_procedure_config_update(db: Session, bulk_update: List, procedure_config_id: int, steps: List[ProcedureConfigStepPatch]):
    for i in range(len(steps)):
        bulk_update = _update_procedure_config_steps_bulk(db, bulk_update, procedure_config_id, i, steps[i])
    return bulk_update


def _update_procedure_config_steps_bulk(db: Session, bulk_update: List, procedure_config_id: int, order: int, step: ProcedureConfigStepPatch):
    config_step_update = dict(step)
    config_step_update["procedure_config_id"] = procedure_config_id
    config_step_update["order"] = order
    if step.counterbalance is not None:
        config_step_update["counterbalance"] = step.counterbalance
    if step.block_id is not None and step.block is not None:
        bulk_update = _iterate_procedure_config_update(db, bulk_update, step.block_id, step.block)
    bulk_update.append(config_step_update)
    return bulk_update
