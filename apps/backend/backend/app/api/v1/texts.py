from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods.dependencies.roles import TextIdRoleCheck, is_allowed
from methods.dependencies.security import ParticipantValidator, UserValidator
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.populated

import model

router = APIRouter()

ENTITY = "Text"

TextIdCheck = Depends(TextIdRoleCheck())

@router.get("/texts/{text_id}", response_model=schema.populated.TextPopulated)
async def read_text(text_id: int = TextIdCheck, db: Session = Depends(get_db)):
    text = methods.read(db, model.Text, text_id)
    return text


@router.get("/texts", response_model=List[schema.populated.TextPopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_texts(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Text)


# @router.post("/texts", response_model=schema.populated.TextPopulated)
# async def create_text(text: schema.text.TextCreate,
#                       db: Session = Depends(get_db)):
#     return methods.create(db, model.Text, text)


@router.post("/texts", response_model=schema.text.Text, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_text_for_study(text: schema.text.TextCreate,
                                user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                                db: Session = Depends(get_db)):
    study = methods.check_if_study_exists(db, text.study_id)
    is_allowed(study, user)
    return methods.create(db, model.Text, text)


@router.patch("/texts/{text_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_text(text_id: int = TextIdCheck, text: schema.text.TextPatch = None, db: Session = Depends(get_db)):
    text_update = methods.patch(db, model.Text, text, text_id)
    if_not_zero(text_update, ENTITY)
    return text_update


@router.delete("/texts/{text_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_text(text_id: int = TextIdCheck, db: Session = Depends(get_db)):
    text = methods.read(db, model.Text, text_id)
    methods.check_if_study_running(db, text.study_id)
    db.delete(text)
    db.commit()
    return
