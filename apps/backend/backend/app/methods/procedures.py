from collections import deque
from typing import List, Union

from sqlalchemy.orm import Session

import model

import methods.conditions

from schema.procedure import ProcedureCondition, ProcedureText, ProcedureQuestionnaire
from schema.procedure_progress import ProcedureProgressStateEnum, ProcedureProgressCreate

from datetime import datetime

def read_procedure_ids_by_study(db: Session, study_id: int):
    procedure_ids = db.query(model.Procedure.id.label('id')). \
        filter(model.Procedure.study_id == study_id).\
        all()
    return procedure_ids


def create_procedures_with_steps(db: Session, study_id: int, steps: List[Union[ProcedureCondition,
                                                                               ProcedureText,
                                                                               ProcedureQuestionnaire]]):
    condition_ids = methods.conditions.read_condition_ids_by_study(db, study_id)
    latin_squared_ids = _latin_square(condition_ids)
    return _create_procedure_steps_bulk(db, study_id, steps, latin_squared_ids)


def _create_procedure_steps_bulk(db: Session,
                                 study_id: int,
                                 procedure_steps: List[Union[ProcedureCondition,
                                                             ProcedureText,
                                                             ProcedureQuestionnaire]],
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
