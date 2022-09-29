from fastapi import HTTPException
from sqlalchemy.orm import Session

import model

import methods
from api.utils import if_exists


def check_if_study_exists(db: Session, study_id: int):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")

def check_if_study_active(db: Session, study_id: int):
    study = methods.read(db, model.Study, study_id)
    if study.is_active:
        raise HTTPException(status_code=403, detail="Study is active")