from typing import Literal

from fastapi import HTTPException
from passlib.context import CryptContext
from sqlalchemy import or_
from starlette import status
from sqlalchemy.orm import Session

import methods
import model
from schema.user import UserOrderByFields


def verify_password(plain_password, hashed_password):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password):
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    return pwd_context.hash(password)


def authenticate_user(db, username: str, password: str):
    user = methods.read_by(db, model.User, "name", username)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def read_users(db: Session, offset: int = 0, limit: int = 100, order_by: UserOrderByFields = "id", direction: Literal["asc", "desc"] = "asc", search: str = None):
    if search:
        return db.query(model.User).filter(
            or_(
                model.User.firstname.ilike(f'%{search}%'),
                model.User.lastname.ilike(f'%{search}%'),
                model.User.email.ilike(f'%{search}%')
            )
        ).order_by(order_query(model.User, order_by, direction)).offset(offset).limit(limit).all()
    return db.query(model.User).order_by(order_query(model.User, order_by, direction)).offset(offset).limit(limit).all()


def users_count(db: Session):
    return db.query(model.User).count()


def order_query(query_model: model.User, order: UserOrderByFields, direction: Literal["asc", "desc"]):
    if direction == "asc":
        return query_model.__table__.c[order].asc()
    return query_model.__table__.c[order].desc()
