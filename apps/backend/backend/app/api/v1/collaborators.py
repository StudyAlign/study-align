from fastapi import Depends, APIRouter, HTTPException
from typing import List

from starlette import status

from model.base import Session
from api import get_db, if_exists

import methods

import schema.populated
import schema.condition

import model

router = APIRouter()

ENTITY = "Collaborator"


@router.get("/collaborators/study/{study_id}", response_model=List[schema.populated.CollaboratorPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_collaborators(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    collaborators = methods.read_list_by(db, model.Collaborator, "study_id", study_id)
    return collaborators


@router.post("/collaborators", response_model=schema.populated.CollaboratorPopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_collaborator(collaborator: schema.collaborator.CollaboratorCreate, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, collaborator.study_id)
    if_exists(study, "Study")

    user = methods.read(db, model.User, collaborator.user_id)
    if_exists(user, "User")

    if collaborator.user_id == study.owner_id:
        raise HTTPException(status_code=409, detail="Cannot add owner as collaborator")

    already_collaborator = methods.read_by(db, model.Collaborator, "user_id", collaborator.user_id)
    if already_collaborator:
        raise HTTPException(status_code=400, detail="User is already a collaborator")

    return methods.create(db, model.Collaborator, collaborator)


@router.delete("/collaborators/{collaborator_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_collaborator(collaborator_id: int, db: Session = Depends(get_db)):
    collaborator = methods.read(db, model.Collaborator, collaborator_id)
    if_exists(collaborator, ENTITY)
    db.delete(collaborator)
    db.commit()
    return

