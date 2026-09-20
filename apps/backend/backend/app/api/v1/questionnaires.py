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
    data = questionnaire.dict()
    # Copy-on-place: a native step renders a study-scoped copy of the chosen
    # global questionnaire, so later edits to the global source cannot change a
    # placed (or running) study.
    if questionnaire.system == "native" and questionnaire.source_form_id:
        src = methods.read(db, model.Form, questionnaire.source_form_id)
        if src is not None:
            copy = methods.copy_template(db, src, questionnaire.study_id, owner_id=user.id)
            data["form_id"] = copy.id
            data["source_form_id"] = questionnaire.source_form_id
    return methods.create(db, model.Questionnaire, data)


@router.patch("/questionnaires/{questionnaire_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_questionnaire(questionnaire_id: int = QuestionnaireIdCheck, questionnaire: schema.questionnaire.QuestionnairePatch = None,
                               db: Session = Depends(get_db)):
    existing = methods.read(db, model.Questionnaire, questionnaire_id)
    if_exists(existing, ENTITY)
    patch_data = questionnaire.dict(exclude_unset=True)
    # The backend owns the study-copy pointer; never take form_id from the client.
    patch_data.pop("form_id", None)

    # Copy-on-place: if the chosen global source changed, make a fresh study copy
    # and drop the previous one. Otherwise keep the existing study copy untouched
    # (so a study's own edits, and running studies, are unaffected).
    new_source = patch_data.get("source_form_id")
    if new_source is not None and new_source != existing.source_form_id:
        src = methods.read(db, model.Form, new_source)
        if src is not None:
            old_copy_id = existing.form_id
            copy = methods.copy_template(db, src, existing.study_id, owner_id=None)
            patch_data["form_id"] = copy.id
            if old_copy_id:
                old = methods.read(db, model.Form, old_copy_id)
                if old is not None and old.study_id == existing.study_id and not old.is_template:
                    db.delete(old)

    for key, value in patch_data.items():
        setattr(existing, key, value)
    db.commit()
    return


@router.delete("/questionnaires/{questionnaire_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_questionnaire(questionnaire_id: int = QuestionnaireIdCheck, db: Session = Depends(get_db)):
    questionnaire = methods.read(db, model.Questionnaire, questionnaire_id)
    methods.check_if_study_running(db, questionnaire.study_id)
    db.delete(questionnaire)
    db.commit()
    return
