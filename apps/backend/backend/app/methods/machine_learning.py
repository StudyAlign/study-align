import os
import shutil
from pathlib import Path
from typing import Union, Any, Dict

import model
from fastapi import UploadFile, HTTPException
from sqlalchemy.orm import Session, joinedload

from definitions import MODELS_DIR
from model.base import Base


def read_model_list_by_condition_id(db: Session, model: Base, field: str, value: Union[str, int], join: str):
    return db.query(model). \
        options(joinedload(join)). \
        filter_by(**{field: value}). \
        all()


def replace_in_dict(data: Dict[str, Any], key: str, value: Any):
    if value:
        data[key] = value
    return data


def replace_on_object(object: model.MLModel, key: str, value: Any):
    if value:
        object[key] = value
    return object


def create_path(ml_model: UploadFile, key: str):
    file_suffix = Path(ml_model.filename).suffix
    if not file_suffix:
        raise HTTPException(status_code=409, detail="File needs a suffix / extension.")
    filename = key + file_suffix
    return os.path.join(MODELS_DIR, filename)


def upload_model(ml_model: UploadFile, path: str):
    try:
        upload_folder = open(path, 'wb+')
        shutil.copyfileobj(ml_model.file, upload_folder)
    except OSError as err:
        print("OS error: {0}".format(err))
        raise HTTPException(status_code=409, detail="Failed to save uploaded model.")
    finally:
        ml_model.file.close()


def create_machine_learning_model_with_upload(db: Session, machine_learning: model.MLModel, ml_model: UploadFile):
    db.add(machine_learning)
    db.flush()

    path = create_path(ml_model, str(machine_learning.key))
    machine_learning.path = path

    upload_model(ml_model, path)

    db.commit()
    db.refresh(machine_learning)
