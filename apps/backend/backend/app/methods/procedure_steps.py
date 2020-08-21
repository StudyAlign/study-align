from fastapi import HTTPException
from sqlalchemy.orm import Session

import model

import schema.populated


def read_ordered_procedure_steps(db: Session, procedure_id: int):
    procedure_steps = db.query(model.ProcedureStep).\
        filter(model.ProcedureStep.procedure_id == procedure_id).\
        order_by(model.ProcedureStep.order.asc()).\
        all()
    return procedure_steps


def get_procedure_step(procedure_step: schema.populated.ProcedureStepPopulated):
    if procedure_step.condition is not None:
        return procedure_step.condition
    if procedure_step.text is not None:
        return procedure_step.text
    if procedure_step.questionnaire is not None:
        return procedure_step.questionnaire

    raise HTTPException(status_code=409, detail="Failed to get specific procedure step.")