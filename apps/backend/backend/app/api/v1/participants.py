from datetime import datetime
from typing import List, Union

from fastapi import Depends, APIRouter, HTTPException

from model.base import Session
from api import get_db, if_exists

import model

import methods

import schema.populated
import schema.api
import schema.participant

router = APIRouter()

ENTITY = "Participant"


@router.get("/participants/me", response_model=schema.participant.Participant)
async def read_participant_me(participant: schema.participant.Participant = Depends(methods.get_active_participant)):
    return participant


@router.get("/participants/refresh", response_model=schema.api.AccessToken)
async def refresh_participant_token(
        participant: schema.participant.Participant = Depends(methods.participantRefreshTokenValidator),
        db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, participant.study_id)
    if_exists(study, "Study")
    if not study.isActive and datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study is too old, or inactive")
    return methods.api.issue_access_token(str(participant.token), role=methods.Role.PARTICIPANT)


@router.get("/participants/{participant_id}", response_model=schema.populated.ParticipantPopulated, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_participant(participant_id: int, db: Session = Depends(get_db)):
    participant = methods.read(db, model.Participant, participant_id)
    if_exists(participant, ENTITY)
    return participant


@router.get("/participants", response_model=List[schema.populated.ParticipantPopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_participants_by_procedure(procedure_id: int, db: Session = Depends(get_db)):
    procedure = methods.read(db, model.Procedure, procedure_id)
    if_exists(procedure, "Procedure")
    return methods.read_list_by(db, model.Participant, "procedure_id", procedure_id)
