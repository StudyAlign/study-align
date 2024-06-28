from enum import Enum
from typing import Union, List, Dict

from sqlalchemy.orm import Session, joinedload
from sqlalchemy import update

from model.base import Base

from pydantic import BaseModel


def read(db: Session, model: Base, id: int):
    return db.query(model).\
        filter(model.id == id).\
        one_or_none()


def read_by(db: Session, model: Base, field: str, value: Union[str, int]):
    return db.query(model).\
        filter_by(**{field: value}).\
        one_or_none()


def read_by_dict(db: Session, model: Base, filter_dict: dict):
    return db.query(model).\
        filter_by(**filter_dict).\
        one_or_none()


def read_with_join(db: Session, model: Base, id: int, join: str):
    return db.query(model). \
        options(joinedload(join)). \
        filter(model.id == id). \
        one_or_none()


def read_list_by(db: Session, model: Base, field: str, value: Union[str, int]):
    return db.query(model).\
        filter_by(**{field: value}).\
        all()


def read_list_by_dict(db: Session, model: Base, filter_dict: dict):
    return db.query(model).\
        filter_by(**filter_dict).\
        all()


def read_list(db: Session, model: Base):
    return db.query(model).all()


def create(db: Session, model: Base, data: Union[BaseModel, Dict]):
    if isinstance(data, BaseModel):
        data = data.dict()

    db_data = model(**data)
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data


def patch(db: Session, model: Base, data: Union[BaseModel, Dict], id: int, synchronize_session: str = "evaluate"):
    if isinstance(data, BaseModel):
        data = data.dict(exclude_unset=True)

    db_data = db.query(model).\
        filter(model.id == id).\
        update(data, synchronize_session=synchronize_session)
    db.commit()
    return db_data


def patch_all(db: Session, model: Base, data: List[Union[BaseModel, Dict]], synchronize_session: str = "evaluate"):
    db.execute(
        update(model),
        data
    )
    db.commit()

    # synch session afterwards?!
    return


def create_for_relation(db: Session, model: Base, data: Base, fk_name: str, id: int, exclude_unset: bool = False):
    clean_data = data.dict(exclude_unset=exclude_unset)
    db_data = model(**clean_data, **{fk_name: id})
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data


def count_by(db: Session, model: Base, field: str, value: Union[str, int]):
    return db.query(model.id).\
        filter_by(**{field: value}).\
        count()


def count_by_dict(db: Session, model: Base, filter_dict: dict):
    return db.query(model).\
        filter_by(**filter_dict).\
        count()