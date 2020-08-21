from typing import Any

from fastapi import HTTPException

from model.base import Session


def get_db():
    db = Session()
    try:
        yield db
    finally:
        db.close()


def if_exists(data: Any, entity: str):
    if not data:
        raise HTTPException(status_code=404, detail=not_found(entity))


def if_not_zero(data: Any, entity: str):
    if data == 0:
        raise HTTPException(status_code=404, detail=not_found(entity))


def not_found(entity: str):
    return "%s not found" % entity

