from typing import List, Union

import model
from fastapi import Depends, APIRouter, HTTPException

from model.base import Session
from api import get_db, if_exists

import methods

import schema.populated
import schema.procedure

router = APIRouter()

ENTITY = "ProcedureStep"


@router.get("/procedure-steps", response_model=Union[schema.condition.ConditionStep,
                                 schema.questionnaire.QuestionnaireStep,
                                 schema.text.TextStep])
async def read_current_procedure_step(participant: schema.populated.ParticipantPopulated = Depends(methods.get_active_participant),
                          db: Session = Depends(get_db)):
    if participant.current_procedure_step is None:
        raise HTTPException(status_code=409, detail="Procedure not started yet.")


    return methods.get_procedure_step(participant.procedure_step)

@router.get("/procedure-steps/{procedure_id}", response_model=List[schema.populated.ProcedureStepPopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_procedure_steps_by_procedure_id(procedure_id: int, db: Session = Depends(get_db)):
    procedure_steps = methods.read_ordered_procedure_steps(db, procedure_id)
    return procedure_steps
