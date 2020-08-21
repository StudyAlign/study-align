from datetime import datetime

from fastapi import Depends, APIRouter, status, HTTPException
from typing import List, Union
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

import schema.study
import schema.procedure
import schema.api

router = APIRouter()

ENTITY = "Study"


@router.get("/studies", response_model=List[schema.study.Study], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_studies(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Study)


@router.post("/studies", response_model=schema.study.Study, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def create_study(study: schema.study.StudyCreate, db: Session = Depends(get_db)):
    return methods.create(db, model.Study, study)


@router.get("/studies/{study_id}", response_model=schema.study.Study)
async def read_study(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    return study


@router.patch("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_study(study_id: int, study: schema.study.StudyUpdate, db: Session = Depends(get_db)):
    study_update = methods.patch(db, model.Study, study, study_id)
    if_not_zero(study_update, ENTITY)
    return study_update


@router.post("/studies/{study_id}/procedures", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def generate_procedures_with_steps(study_id: int,
                                         steps: List[Union[schema.procedure.ProcedureCondition,
                                                           schema.procedure.ProcedureText,
                                                           schema.procedure.ProcedureQuestionnaire]],
                                         db: Session = Depends(get_db)):
    procedures = methods.read_list_by(db, model.Procedure, "study_id", study_id)
    if procedures:
        raise HTTPException(status_code=409, detail="Procedures have already been generated")
    return methods.create_procedures_with_steps(db, study_id, steps)


@router.post("/studies/{study_id}/participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def generate_participants(study_id: int, amount: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    participant_count = methods.count_by(db, model.Participant, "study_id", study_id)
    if participant_count != 0:
        raise HTTPException(status_code=409, detail="Participants have already been generated")
    return methods.create_participants(db, study_id, amount)


@router.get("/studies/{study_id}/participate", response_model=schema.api.Tokens)
async def participate(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    if not study.isActive and datetime.datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study is too old, or inactive")
    participant = methods.draw_participant(db, study_id)
    if not participant:
        raise HTTPException(status_code=409, detail="No Participants found")
    return methods.api.issue_tokens(str(participant.token), study.endDate, role=methods.Role.PARTICIPANT)
