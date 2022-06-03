from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods.dependencies.security import ParticipantValidator, UserValidator
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.populated

import model

router = APIRouter()

ENTITY = "Text"


@router.get("/texts/{text_id}", response_model=schema.populated.TextPopulated)
async def read_text(text_id: int, db: Session = Depends(get_db),
                    participant: schema.participant.Participant = Depends(ParticipantValidator()),
                    user: schema.user.User = Depends(UserValidator())
                    ):
    text = methods.read(db, model.Text, text_id)
    if_exists(text, ENTITY)
    return text


@router.get("/texts", response_model=List[schema.populated.TextPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_texts(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Text)


@router.post("/texts", response_model=schema.populated.TextPopulated)
async def create_text(text: schema.text.TextCreate,
                      db: Session = Depends(get_db)):
    return methods.create(db, model.Text, text)


@router.post("/texts", response_model=schema.text.Text, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_text_for_study(text: schema.text.TextCreate, db: Session = Depends(get_db)):
    methods.check_if_study_exists(db, text.study_id)
    return methods.create(db, model.Text, text)


@router.patch("/texts/{text_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_text(text_id: int, text: schema.text.TextPatch, db: Session = Depends(get_db)):
    text_update = methods.patch(db, model.Text, text, text_id)
    if_not_zero(text_update, ENTITY)
    return text_update
