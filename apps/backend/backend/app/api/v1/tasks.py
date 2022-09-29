from fastapi import Depends, APIRouter
from typing import List

from starlette import status

from methods.dependencies.security import ParticipantValidator, UserValidator
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.populated
import schema.task
import schema.condition

import model

router = APIRouter()

ENTITY = "Task"


@router.get("/tasks/{task_id}", response_model=schema.populated.TaskPopulated)
async def read_task(task_id: int, db: Session = Depends(get_db),
                    participant: schema.participant.Participant = Depends(ParticipantValidator()),
                    user: schema.user.User = Depends(UserValidator())
                    ):
    task = methods.read(db, model.Task, task_id)
    if_exists(task, ENTITY)
    return task


@router.get("/tasks", response_model=List[schema.populated.TaskPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_tasks(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Task)


@router.post("/tasks", response_model=schema.populated.TaskPopulated, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_task(task: schema.task.TaskCreate, db: Session = Depends(get_db)):
    return methods.create(db, model.Task, task)


@router.patch("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_task(task_id: int, task: schema.task.TaskPatch, db: Session = Depends(get_db)):
    task_update = methods.patch(db, model.Task, task, task_id)
    if_not_zero(task_update, ENTITY)
    return task_update


@router.delete("/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_task(task_id: int, db: Session = Depends(get_db)):
    task = methods.read(db, model.Task, task_id)
    if_exists(task, ENTITY)
    db.delete(task)
    db.commit()
    return

