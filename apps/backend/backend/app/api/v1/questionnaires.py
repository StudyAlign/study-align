from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

import schema.populated
import schema.questionnaire

router = APIRouter()

ENTITY = "Questionnaire"


@router.get("/questionnaires/{questionnaire_id}", response_model=schema.populated.QuestionnairePopulated, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_questionnaire(questionnaire_id: int, db: Session = Depends(get_db)):
    questionnaire = methods.read(db, model.Questionnaire, questionnaire_id)
    if_exists(questionnaire, ENTITY)
    return questionnaire


@router.get("/questionnaires", response_model=List[schema.populated.QuestionnairePopulated], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_questionnaires(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Questionnaire)


@router.post("/questionnaires", response_model=schema.populated.QuestionnairePopulated, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def create_questionnaire(questionnaire: schema.questionnaire.QuestionnaireCreate, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, questionnaire.study_id)
    if_exists(study, ENTITY)
    return methods.create(db, model.Questionnaire, questionnaire)


@router.patch("/questionnaires/{questionnaire_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_questionnaire(questionnaire_id: int, questionnaire: schema.questionnaire.QuestionnairePatch, db: Session = Depends(get_db)):
    questionnaire_update = methods.patch(db, model.Questionnaire, questionnaire, questionnaire_id)
    if_not_zero(questionnaire_update, ENTITY)
    return questionnaire_update

