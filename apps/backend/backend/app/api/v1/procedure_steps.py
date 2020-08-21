from typing import List

from fastapi import Depends, APIRouter

from model.base import Session
from api import get_db

import methods

import schema.populated
import schema.procedure

router = APIRouter()

ENTITY = "ProcedureStep"


@router.get("/procedure-steps", response_model=List[schema.populated.ProcedureStepPopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_procedure_steps_by_procedure_id(procedure_id: int, db: Session = Depends(get_db)):
    procedure_steps = methods.read_ordered_procedure_steps(db, procedure_id)
    return procedure_steps
