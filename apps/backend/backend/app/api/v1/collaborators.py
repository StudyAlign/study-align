from fastapi import Depends, APIRouter, HTTPException
from typing import List

from starlette import status

from methods import UserValidator
from methods.dependencies.roles import StudyIdRoleCheck, is_allowed, CollaboratorIdRoleCheck
from model.base import Session
from api import get_db, if_exists

import methods

import schema.populated
import schema.condition

import model

router = APIRouter()

ENTITY = "Collaborator"

StudyIdCheck = Depends(StudyIdRoleCheck())
@router.get("/collaborators/study/{study_id}", response_model=List[schema.populated.CollaboratorPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_collaborators(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    collaborators = methods.read_list_by(db, model.Collaborator, "study_id", study_id)
    return collaborators


@router.post("/collaborators", response_model=schema.populated.CollaboratorPopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_collaborator(collaborator: schema.collaborator.CollaboratorCreate, user: schema.user.User = Depends(UserValidator(strict_auth_method=True)), db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, collaborator.study_id)
    if_exists(study, "Study")

    collab_user = methods.read(db, model.User, collaborator.user_id)
    if_exists(collab_user, "User")

    is_allowed(study, user)

    if collaborator.user_id == study.owner_id:
        raise HTTPException(status_code=409, detail="Cannot add owner as collaborator")

    already_collaborator = methods.read_by_dict(db, model.Collaborator, {"study_id": collaborator.study_id, "user_id": collaborator.user_id})
    if already_collaborator:
        raise HTTPException(status_code=400, detail="User is already a collaborator")

    return methods.create(db, model.Collaborator, collaborator)


CollaboratorIdCheck = Depends(CollaboratorIdRoleCheck())
@router.delete("/collaborators/{collaborator_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_collaborator(collaborator_id: int = CollaboratorIdCheck, db: Session = Depends(get_db)):
    collaborator = methods.read(db, model.Collaborator, collaborator_id)
    if_exists(collaborator, ENTITY)
    db.delete(collaborator)
    db.commit()
    return

