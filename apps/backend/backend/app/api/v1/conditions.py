from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods.dependencies.security import UserValidator, ParticipantValidator
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

import schema.populated
import schema.condition
import schema.participant
import schema.user

router = APIRouter()

ENTITY = "Condition"


# Admin and Researcher access, Researchers see only their own conditions (owner or collaborator)
@router.get("/conditions/ids", response_model=List[int], dependencies=[Depends(methods.userAccessTokenValidator)])
async def get_condition_ids_by_study(study_id: int, db: Session = Depends(get_db)):
    return methods.read_condition_ids_by_study(db, study_id)


# Admin, Researcher, and Participant access, Researchers see only their own conditions (owner or collaborator)
@router.get("/conditions/{condition_id}", response_model=schema.populated.ConditionPopulated)
async def read_condition(condition_id: int, db: Session = Depends(get_db),
                         participant: schema.participant.Participant = Depends(ParticipantValidator()),
                         user: schema.user.User = Depends(UserValidator())):
    condition = methods.read(db, model.Condition, condition_id)
    if_exists(condition, ENTITY)

    # if participant is in study AND researcher owns or collaborates in study
    return condition


@router.get("/conditions", response_model=List[schema.populated.ConditionPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_conditions(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Condition)


@router.post("/conditions", response_model=schema.condition.Condition, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_condition(condition: schema.condition.ConditionCreate, db: Session = Depends(get_db)):
    methods.check_if_study_exists(db, condition.study_id)
    return methods.create(db, model.Condition, condition)


@router.patch("/conditions/{condition_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_condition(condition_id: int, condition: schema.condition.ConditionPatch, db: Session = Depends(get_db)):
    condition_update = methods.patch(db, model.Condition, condition, condition_id)
    if_not_zero(condition_update, ENTITY)
    return condition_update


@router.get("/conditions/{condition_id}/config", response_model=schema.condition.ConditionConfig, dependencies=[Depends(methods.participantLoggerKeyValidator)])
async def read_condition_config(condition_id: int, db: Session = Depends(get_db)):
    condition = methods.read(db, model.Condition, condition_id)
    if_exists(condition, ENTITY)
    return condition
