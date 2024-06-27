from fastapi import Depends, APIRouter

from starlette import status

from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.procedure_config

import model

router = APIRouter()

ENTITY = "ProcedureConfig"


@router.get("/procedure-configs/{procedure_config_id}", response_model=schema.procedure_config.ProcedureConfig, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_procedure_config(procedure_config_id: int, db: Session = Depends(get_db)):
    procedure_config = methods.read(db, model.ProcedureConfig, procedure_config_id)
    if_exists(procedure_config, ENTITY)
    return procedure_config


@router.get("/procedure-configs/{procedure_config_id}/overview", response_model=schema.populated.ProcedureConfigOverview, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_procedure_config(procedure_config_id: int, db: Session = Depends(get_db)):
    procedure_config = methods.read(db, model.ProcedureConfig, procedure_config_id)
    if_exists(procedure_config, ENTITY)
    return procedure_config


# Create a block element
@router.post("/procedure-configs/block", response_model=schema.procedure_config.ProcedureConfigBlock, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_procedure_config_block(procedure_config_block: schema.procedure_config.ProcedureConfigBlockCreate,
                      db: Session = Depends(get_db)):
    return methods.create(db, model.ProcedureConfig, procedure_config_block)


@router.delete("/procedure-configs/block/{block_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_procedure_config_block(block_id: int, db: Session = Depends(get_db)):
    block = methods.read(db, model.ProcedureConfig, block_id)
    if_exists(block, ENTITY)
    methods.check_if_study_active(db, block.study_id)
    db.delete(block)
    db.commit()
    return


# Create steps from any element (condition, text, questionnnaire, pause or block)
@router.post("/procedure-configs/{procedure_config_id}/step", response_model=schema.procedure_config.ProcedureConfigStep, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_procedure_config_step(procedure_config_id: int, procedure_config_step: schema.procedure_config_step.ProcedureConfigCreateSingleStep,
                      db: Session = Depends(get_db)):
    return methods.create_procedure_config_step(db, procedure_config_id, procedure_config_step)


@router.post("/procedure-configs/{procedure_config_id}/create-steps", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_procedure_config_steps(procedure_config_id: int, procedure_config_steps: schema.procedure_config_step.ProcedureConfigCreateAllSteps,
                      db: Session = Depends(get_db)):
    return methods.create_procedure_config_steps(db, procedure_config_id, procedure_config_steps)


@router.patch("/procedure-configs/{procedure_config_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_procedure_config_steps(procedure_config_id: int, procedure_config_steps: schema.procedure_config_step.ProcedureConfigUpdateAllSteps,
                      db: Session = Depends(get_db)):
    return methods.update_procedure_config_steps(db, procedure_config_id, procedure_config_steps)
