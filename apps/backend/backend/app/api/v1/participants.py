from datetime import datetime
from typing import List, Union

import uuid
from fastapi import Depends, APIRouter, HTTPException
from starlette import status

from methods import ParticipantValidator
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
        participant: schema.participant.Participant = Depends(ParticipantValidator(type=methods.REFRESH)),
        db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, participant.study_id)
    if_exists(study, "Study")
    if not study.is_active and datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study is too old, or inactive")
    return methods.api.issue_access_token(str(participant.token), auth_method=methods.AuthMethod.PARTICIPANT_KEY)


@router.get("/participants/{participant_id}", response_model=schema.populated.ParticipantPopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_participant(participant_id: int, db: Session = Depends(get_db)):
    participant = methods.read(db, model.Participant, participant_id)
    if_exists(participant, ENTITY)
    return participant


@router.get("/participants", response_model=List[schema.populated.ParticipantPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_participants_by_procedure(procedure_id: int, db: Session = Depends(get_db)):
    procedure = methods.read(db, model.Procedure, procedure_id)
    if_exists(procedure, "Procedure")
    return methods.read_list_by(db, model.Participant, "procedure_id", procedure_id)


@router.get("/participants/{participant_token}/end-pause", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def end_participants_step_pause(participant_token: uuid.UUID, db: Session = Depends(get_db)):
    participant = methods.read_by(db, model.Participant, "token", str(participant_token))
    if_exists(participant, ENTITY)
    procedure_step = participant.procedure_step
    if participant.procedure_step.pause is not None:
        pause_type = schema.pause.PauseTypeEnum(procedure_step.pause.type)
        if pause_type is schema.pause.PauseTypeEnum.controlled:
            participant.current_procedure_step_config = {"proceed": True}
            db.commit()
    return

