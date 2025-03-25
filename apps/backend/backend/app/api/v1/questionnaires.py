import json

from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods import UserValidator
from methods.dependencies.roles import QuestionnaireIdRoleCheck, is_allowed
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

import schema.populated
import schema.questionnaire

router = APIRouter()

ENTITY = "Questionnaire"

QuestionnaireIdCheck = Depends(QuestionnaireIdRoleCheck())
@router.get("/questionnaires/{questionnaire_id}", response_model=schema.populated.QuestionnairePopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_questionnaire(questionnaire_id: int = QuestionnaireIdCheck, db: Session = Depends(get_db)):
    questionnaire = methods.read(db, model.Questionnaire, questionnaire_id)
    return questionnaire


@router.get("/questionnaires", response_model=List[schema.populated.QuestionnairePopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_questionnaires(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Questionnaire)


@router.post("/questionnaires", response_model=schema.populated.QuestionnairePopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_questionnaire(questionnaire: schema.questionnaire.QuestionnaireCreate,
                               user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                               db: Session = Depends(get_db)):
    study = methods.check_if_study_exists(db, questionnaire.study_id)
    is_allowed(study, user)
    return methods.create(db, model.Questionnaire, questionnaire)


@router.patch("/questionnaires/{questionnaire_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_questionnaire(questionnaire_id: int = QuestionnaireIdCheck, questionnaire: schema.questionnaire.QuestionnairePatch = None,
                               db: Session = Depends(get_db)):
    questionnaire_update = methods.patch(db, model.Questionnaire, questionnaire, questionnaire_id, 'fetch')
    if_not_zero(questionnaire_update, ENTITY)
    return questionnaire_update


@router.delete("/questionnaires/{questionnaire_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_questionnaire(questionnaire_id: int = QuestionnaireIdCheck, db: Session = Depends(get_db)):
    questionnaire = methods.read(db, model.Questionnaire, questionnaire_id)
    methods.check_if_study_running(db, questionnaire.study_id)
    db.delete(questionnaire)
    db.commit()
    return
