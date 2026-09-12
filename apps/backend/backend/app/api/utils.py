from typing import Any
from re import sub

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
    if data == 0 or not data:
        raise HTTPException(status_code=404, detail=not_found(entity))


def if_belongs_to_study(data: Any, study_id: int):
    if data.study_id != study_id:
        raise HTTPException(status_code=409, detail="%s does not belong to study with id %d" % (str(data), study_id))


def not_found(entity: str):
    return "%s not found" % entity


def slugify(s):
  s = s.lower().strip()
  s = sub(r'[^\w\s-]', '', s)
  s = sub(r'[\s_-]+', '_', s)
  s = sub(r'^-+|-+$', '', s)
  return s
