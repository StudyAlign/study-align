import os
import shutil
import uuid
from datetime import datetime
from typing import Union, List, Optional

from fastapi import Depends, APIRouter, File, UploadFile, Form, HTTPException
from pydantic.main import BaseModel
from sqlalchemy import exc
from sqlalchemy.orm import make_transient
from starlette.responses import FileResponse

import requests

import methods
from api import get_db, if_exists
from definitions import MODELS_DIR

from model.base import Session
import model

import schema.populated
import schema.participant
import schema.machine_learning

router = APIRouter()

ENTITY = "Machine Learning"


@router.get("/machine-learning/generate-key",
            response_model=uuid.UUID,
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def generate_key_for_cloud_model(db: Session = Depends(get_db)):
    key = uuid.uuid4()
    while methods.read_by(db, model.MLModel, "key", str(key)):
        key = uuid.uuid4()
    return key


@router.get("/machine-learning/models",
            response_model=List[
                Union[schema.populated.MLModelCloudPopulated, schema.populated.MLModelDistributePopulated]],
            dependencies=[Depends(methods.switchAccessTokenValidator)])
async def read_machine_learning_models_by_condition_id(condition_id: int, db: Session = Depends(get_db)):
    machine_learning_models = methods.read_model_list_by_condition_id(db, model.MLModel, "condition_id", condition_id,
                                                                      "condition")

    result = []
    for ml_model in machine_learning_models:
        if ml_model.distribute:
            result.append(schema.populated.MLModelDistributePopulated(**ml_model.__dict__))
        else:
            result.append(schema.populated.MLModelCloudPopulated(**ml_model.__dict__))
    return result


@router.get("/machine-learning/{machine_learning_id}",
            response_model=Union[schema.populated.MLModelCloudPopulated, schema.populated.MLModelDistributePopulated])
async def read_machine_learning_model(machine_learning_id: int,
                                      participant: model.Participant = Depends(methods.access_switch_participant),
                                      db: Session = Depends(get_db)):
    machine_learning = methods.read_with_join(db, model.MLModel, machine_learning_id, "condition")
    if_exists(machine_learning, ENTITY)
    methods.is_participant_allowed_to_use_model(db, participant, machine_learning)

    if machine_learning.distribute:
        return schema.populated.MLModelDistributePopulated(**machine_learning.__dict__)
    return schema.populated.MLModelCloudPopulated(**machine_learning.__dict__)


@router.post("/machine-learning/cloud", response_model=schema.machine_learning.ml_model.MLModelCloud,
             dependencies=[Depends(methods.adminAccessTokenValidator)])
async def create_machine_learning_cloud(machine_learning: schema.machine_learning.ml_model.MLModelCreateCloud,
                                        db: Session = Depends(get_db)):
    condition = methods.read(db, model.Condition, machine_learning.condition_id)
    if_exists(condition, "Condition")
    ml_key = methods.read_by(db, model.MLModel, "key", str(machine_learning.key))
    if ml_key:
        detail = "Model key %s already in use" % str(ml_key.key)
        raise HTTPException(status_code=409, detail=detail)
    data = machine_learning.dict()
    data['time'] = datetime.utcnow()
    data['distribute'] = False
    return methods.create(db, model.MLModel, data)


@router.post("/machine-learning/distribute", response_model=schema.machine_learning.ml_model.MLModelDistribute,
             dependencies=[Depends(methods.adminAccessTokenValidator)])
async def create_machine_learning_distribute(ml_model: UploadFile = File(...),
                                             name: str = Form(...),
                                             description: str = Form(...),
                                             active: bool = Form(...),
                                             condition_id: int = Form(...),
                                             db: Session = Depends(get_db)):
    condition = methods.read(db, model.Condition, condition_id)
    if_exists(condition, "Condition")

    path = ""
    try:
        machine_learning_data = {
            "name": name,
            "description": description,
            "active": active,
            "condition_id": condition_id,
            "distribute": True
        }
        machine_learning = schema.machine_learning.ml_model.MLModelCreateDistribute(**machine_learning_data)
        machine_learning_db = model.MLModel(**machine_learning.dict())
        machine_learning_db.time = datetime.utcnow()
        methods.create_machine_learning_model_with_upload(db, machine_learning_db, ml_model)
    except exc.SQLAlchemyError:
        if os.path.exists(path):
            os.remove(path)
        raise HTTPException(status_code=409, detail="Failed to upload machine learning model.")
    return machine_learning_db


@router.get("/machine-learning/{machine_learning_id}/distribute")
async def download_machine_learning_model(machine_learning_id: int,
                                          participant: BaseModel = Depends(methods.access_switch_participant),
                                          db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    methods.is_participant_allowed_to_use_model(db, participant, machine_learning)
    if not machine_learning.distribute:
        raise HTTPException(status_code=403, detail="The model cannot be distributed across participants.")
    if not machine_learning.path or not os.path.exists(machine_learning.path):
        raise HTTPException(status_code=409, detail="The ML model does not exist and cannot be downloaded.")
    return FileResponse(machine_learning.path)


@router.put("/machine-learning/distribute/{machine_learning_id}/new-version",
            response_model=schema.machine_learning.ml_model.MLModelDistribute,
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_machine_learning_distribute_new(machine_learning_id: int,
                                                 ml_model: UploadFile = File(...),
                                                 name: Optional[str] = Form(None),
                                                 description: Optional[str] = Form(None),
                                                 changelog: Optional[str] = Form(None),
                                                 active: Optional[bool] = Form(None),
                                                 condition_id: Optional[int] = Form(None),
                                                 db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    if condition_id:
        condition = methods.read(db, model.Condition, condition_id)
        if_exists(condition, "Condition")

    path = ""
    try:
        db.expunge(machine_learning)
        make_transient(machine_learning)
        old_model_id = machine_learning.id
        machine_learning.id = None
        machine_learning.key = None
        machine_learning.path = None

        machine_learning.name = name or machine_learning.name
        machine_learning.description = description or machine_learning.description
        machine_learning.changelog = changelog or machine_learning.changelog
        machine_learning.active = active or machine_learning.active
        machine_learning.condition_id = condition_id or machine_learning.condition_id
        machine_learning.time = datetime.utcnow()
        machine_learning.old_model_id = old_model_id

        methods.create_machine_learning_model_with_upload(db, machine_learning, ml_model)
    except exc.SQLAlchemyError:
        if os.path.exists(path):
            os.remove(path)
        raise HTTPException(status_code=409, detail="Failed to upload machine learning model.")
    return machine_learning


@router.put("/machine-learning/distribute/{machine_learning_id}/replace-version",
            response_model=schema.machine_learning.ml_model.MLModelDistribute,
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_machine_learning_distribute_replace(machine_learning_id: int,
                                                     ml_model: Optional[UploadFile] = File(None),
                                                     name: Optional[str] = Form(None),
                                                     description: Optional[str] = Form(None),
                                                     changelog: Optional[str] = Form(None),
                                                     active: Optional[bool] = Form(None),
                                                     condition_id: Optional[int] = Form(None),
                                                     db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    if condition_id:
        condition = methods.read(db, model.Condition, condition_id)
        if_exists(condition, "Condition")

    data = {}
    methods.replace_in_dict(data, "name", name)
    methods.replace_in_dict(data, "description", description)
    methods.replace_in_dict(data, "changelog", changelog)
    methods.replace_in_dict(data, "active", active)
    methods.replace_in_dict(data, "condition_id", condition_id)

    path = machine_learning.path
    old_path = path
    backup_path = str(machine_learning.key) + ".BACKUP"

    if ml_model:
        new_path = methods.create_path(ml_model, str(machine_learning.key))
        # make backup copy
        backup_name = str(machine_learning.key) + ".BACKUP"
        backup_path = os.path.join(MODELS_DIR, backup_name)
        shutil.copy2(path, backup_path)
        methods.upload_model(ml_model, new_path)
        data['path'] = new_path
        data['time'] = datetime.utcnow()

    try:
        methods.patch(db, model.MLModel, data, machine_learning_id)
        db.refresh(machine_learning)
    except exc.SQLAlchemyError as err:
        # print("SQLAlchemyError error: {0}".format(err))
        # restore backup and delete uploaded model
        if os.path.exists(backup_path):
            shutil.copy2(backup_path, old_path)
            os.remove(new_path)
        raise HTTPException(status_code=409, detail="Failed to upload machine learning model.")
    finally:
        if os.path.exists(backup_path):
            os.remove(backup_path)
    return machine_learning


@router.put("/machine-learning/cloud/{machine_learning_id}/new-version",
            response_model=schema.machine_learning.ml_model.MLModelCloud,
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_machine_learning_cloud_new(machine_learning_id: int,
                                            machine_learning_update: schema.machine_learning.ml_model.MLModelUpdateCloud,
                                            db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    if machine_learning_update.condition_id:
        condition = methods.read(db, model.Condition, machine_learning_update.condition_id)
        if_exists(condition, "Condition")
    # if machine_learning_update.key:
    #     ml_key = methods.read_by(db, model.MLModel, "key", machine_learning_update.key)
    #     if ml_key:
    #         detail = "Model key %s already in use" % str(ml_key.key)
    #         raise HTTPException(status_code=409, detail=detail)

    old_model_id = machine_learning.id

    machine_learning_current = machine_learning.__dict__
    machine_learning_update = machine_learning_update.dict(exclude_unset=True)

    # replace new data
    machine_learning_new_data = {**machine_learning_current, **machine_learning_update}
    del machine_learning_new_data['id']
    del machine_learning_new_data['_sa_instance_state']
    machine_learning_new_data['time'] = datetime.utcnow()
    machine_learning_new_data['old_model_id'] = old_model_id

    machine_learning.active = False

    return methods.create(db, model.MLModel, machine_learning_new_data)


@router.put("/machine-learning/cloud/{machine_learning_id}/replace-version",
            response_model=schema.machine_learning.ml_model.MLModelCloud,
            dependencies=[Depends(methods.adminAccessTokenValidator)])
async def update_machine_learning_cloud_replace(machine_learning_id: int,
                                                machine_learning_update: schema.machine_learning.ml_model.MLModelUpdateCloud,
                                                db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    if machine_learning_update.condition_id:
        condition = methods.read(db, model.Condition, machine_learning_update.condition_id)
        if_exists(condition, "Condition")

    data = machine_learning_update.dict(exclude_unset=True)
    data['time'] = datetime.utcnow()
    data['path'] = data.get('path') or machine_learning.path
    methods.patch(db, model.MLModel, data, machine_learning_id)
    db.refresh(machine_learning)

    return machine_learning


@router.post("/machine-learning/cloud/{machine_learning_id}/predict",
             response_model=schema.machine_learning.Prediction)
async def make_prediction_cloud(machine_learning_id: int,
                                data: schema.machine_learning.prediction.PredictionInput,
                                participant: model.Participant = Depends(methods.participantAccessTokenValidator),
                                db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)

    api_key = machine_learning.key
    api_url = machine_learning.path
    headers = {'X-API-Key': str(api_key)}
    response = requests.post(api_url + '/predict', data={'input': data.input}, headers=headers)

    response_data = None
    if response.status_code == requests.codes.ok:
        try:
            response_data = response.json()
            print(response_data)
        except ValueError as err:
            print(err)
    else:
        detail = "Model URL (%s) could not be reached" % str(api_url)
        raise HTTPException(status_code=409, detail=detail)

    if response_data:
        prediction = response_data.prediction

        prediction_data = {
            "input": input,
            "prediction": prediction,
            "time": datetime.utcnow(),
            "ml_model_id": machine_learning_id,
            "participant_id": participant.id,
            "condition_id": machine_learning.condition_id
        }
        prediction_create = schema.machine_learning.prediction.PredictionCreate(**prediction_data)
        prediction_db = model.Prediction(**prediction_create.dict())
        return methods.create(db, model.Prediction, prediction_db)

    detail = "Model response (%s) was empty" % str(api_url)
    raise HTTPException(status_code=409, detail=detail)


@router.get("/machine-learning/cloud/{machine_learning_id}/ping",
            dependencies=[Depends(methods.switchAccessTokenValidator)])
async def ping_cloud_model(machine_learning_id: int,
                           db: Session = Depends(get_db)):
    machine_learning = methods.read(db, model.MLModel, machine_learning_id)
    if_exists(machine_learning, ENTITY)
    api_url = machine_learning.path

    try:
        response = requests.get(api_url + '/ping')
        if response.status_code == requests.codes.ok:
            return True
        return False
    except requests.ConnectionError as err:
        print(err)
        return False
