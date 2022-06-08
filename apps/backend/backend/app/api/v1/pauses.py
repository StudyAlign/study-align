from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods.dependencies.security import ParticipantValidator, UserValidator
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.populated
import schema.pause

import model

router = APIRouter()

ENTITY = "Pause"


@router.get("/pauses/{pause_id}", response_model=schema.populated.PausePopulated)
async def read_pause(pause_id: int, db: Session = Depends(get_db),
                    participant: schema.participant.Participant = Depends(ParticipantValidator()),
                    user: schema.user.User = Depends(UserValidator())
                    ):
    pause = methods.read(db, model.Pause, pause_id)
    if_exists(pause, ENTITY)
    return pause


@router.get("/pauses", response_model=List[schema.populated.PausePopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_pauses(db: Session = Depends(get_db)):
    return methods.read_list(db, )


@router.post("/pauses", response_model=schema.populated.PausePopulated)
async def create_pause(pause: schema.pause.PauseCreate,
                      db: Session = Depends(get_db)):
    return methods.create(db, model.Pause, pause)


@router.post("/pauses", response_model=schema.pause.Pause, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_pause_for_study(pause: schema.pause.PauseCreate, db: Session = Depends(get_db)):
    methods.check_if_study_exists(db, pause.study_id)
    return methods.create(db, model.Pause, pause)


@router.patch("/pauses/{pause_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_pause(pause_id: int, pause: schema.pause.PausePatch, db: Session = Depends(get_db)):
    pause_update = methods.patch(db, model.Pause, pause, pause_id)
    if_not_zero(pause_update, ENTITY)
    return pause_update
