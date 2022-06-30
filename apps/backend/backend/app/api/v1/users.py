from fastapi import Depends, APIRouter, HTTPException
from typing import List

from datetime import datetime, timedelta

from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

from methods.api import REFRESH, AuthMethod
from starlette import status

from methods.dependencies.security import UserValidator
from methods.users import authenticate_user, get_password_hash
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods

import schema.populated

import model

router = APIRouter()

ENTITY = "User"


@router.post("/users/login", response_model=schema.api.Tokens)
async def user_login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(db, form_data.username, form_data.password)
    return methods.api.issue_tokens(str(user.id), datetime.utcnow() + timedelta(days=1), auth_method=methods.AuthMethod.USER_LOGIN)


@router.get("/users/me", response_model=schema.populated.UserPopulated)
async def user_me(user: schema.user.User = Depends(UserValidator(strict_auth_method=True))):
    return user


@router.get("/users/refresh", response_model=schema.api.AccessToken)
async def refresh_user_token(user: schema.user.User = Depends(UserValidator(type=REFRESH))):
    return methods.api.issue_access_token(str(user.id), auth_method=methods.AuthMethod.USER_LOGIN)


@router.get("/users", response_model=List[schema.user.User], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_users(db: Session = Depends(get_db)):
    return methods.read_list(db, model.User)


@router.post("/users", response_model=schema.user.User, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_user(user: schema.user.UserCreate, db: Session = Depends(get_db)):
    if user.password:
        user.password = get_password_hash(user.password)
    return methods.create(db, model.User, user)


@router.get("/users/{user_id}", response_model=schema.user.User, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user = methods.read(db, model.User, user_id)
    if_exists(user, ENTITY)
    return user


@router.patch("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_user(user_id: int, user: schema.user.UserUpdate, db: Session = Depends(get_db)):
    if user.password:
        user.password = get_password_hash(user.password)
    user_update = methods.patch(db, model.User, user, user_id)
    if_not_zero(user_update, ENTITY)
    return user_update
