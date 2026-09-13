import uuid
import logging

from fastapi import Depends, APIRouter, HTTPException
from typing import List, Literal

from datetime import datetime, timedelta

from fastapi.security import OAuth2PasswordRequestForm
from passlib.context import CryptContext

from methods.api import REFRESH, AuthMethod
from starlette import status

from methods.dependencies.roles import UserIdRoleCheck
from methods.dependencies.security import UserValidator
from methods.users import authenticate_user, get_password_hash
from model.base import Session
from api import get_db, if_exists, if_not_zero

import methods
from methods.mail import get_user_activation_mail_html, get_email_config, get_password_reset_mail_html

import schema.populated

import model
from schema.user import UserOrderByFields

from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType


router = APIRouter()

ENTITY = "User"

logger = logging.getLogger('studyalign')


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
async def read_users(offset: int = 0, limit: int = 100, order_by: UserOrderByFields = "id", direction: Literal["asc", "desc"] = "asc", search: str = None,
                            db: Session = Depends(get_db)):
    return methods.read_users(db, offset, limit, order_by, direction, search)


@router.get("/users/count", response_model=int, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_users_count(db: Session = Depends(get_db)):
    return methods.users_count(db)


@router.get("/users/roles", response_model=List[schema.role.Role], dependencies=[Depends(methods.adminAccessTokenValidator)])
async def read_roles(db: Session = Depends(get_db)):
    return methods.read_list(db, model.Role)


@router.post("/users", response_model=schema.user.User, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def create_user(user: schema.user.UserCreate, db: Session = Depends(get_db)):
    if user.password:
        user.password = get_password_hash(user.password)
    return methods.create(db, model.User, user)


@router.get("/users/{user_id}", response_model=schema.user.User, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_user(user_id: int, db: Session = Depends(get_db)):
    user = methods.read(db, model.User, user_id)
    if_exists(user, ENTITY)
    return user


UserIdCheck = Depends(UserIdRoleCheck())
@router.patch("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_user(user_id: int = UserIdCheck, user: schema.user.UserUpdate = None, db: Session = Depends(get_db)):
    if user.password:
        user.password = get_password_hash(user.password)
    user_update = methods.patch(db, model.User, user, user_id)
    if_not_zero(user_update, ENTITY)
    return user_update


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.adminAccessTokenValidator)])
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    if user_id == 1:
        raise HTTPException(status_code=403, detail="User with id 1 cannot be deleted.")
    user = methods.read(db, model.User, user_id)
    if_exists(user, ENTITY)
    db.delete(user)
    db.commit()
    return


# Define email config
email_config = get_email_config()


@router.post("/users/register", response_model=schema.user.User)
async def register_user(user: schema.user.UserRegisterForm, db: Session = Depends(get_db)):
    user_db = methods.read_by_dict(db, model.User, {"name": user.name})
    if user_db:
        raise HTTPException(status_code=400, detail="User with this name already exists")

    user_db = methods.read_by_dict(db, model.User, {"email": user.email})
    if user_db:
        raise HTTPException(status_code=400, detail="User with this email already exists")

    if user.password:
        user.password = get_password_hash(user.password)

    user = {
        "name": user.name,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "email": user.email,
        "password": user.password,
        "role_id": 2, #RESEARCHER ROLE
        "is_active": False,
        "email_activation_token": uuid.uuid4(),
    }

    user = schema.user.UserRegister(**user)
    user = methods.create(db, model.User, user)

    html = get_user_activation_mail_html(user.email_activation_token)

    message = MessageSchema(
        subject="StudyAlign activation link",
        recipients=[user.email],
        body=html,
        subtype=MessageType.html)

    fm = FastMail(email_config)
    await fm.send_message(message)

    return user


@router.get("/users/{token}/activate", response_model=schema.user.User)
async def activate_user(token: uuid.UUID, db: Session = Depends(get_db)):
    user = methods.read_by(db, model.User, "email_activation_token", token)
    if_exists(user, ENTITY)

    user.is_active = True
    user.email_activation_token = None

    db.commit()
    db.refresh(user)

    return user


@router.post("/users/forgot-password", status_code=status.HTTP_204_NO_CONTENT)
async def forgot_password(form: schema.user.ForgotPasswordForm, db: Session = Depends(get_db)):
    user = methods.read_by_dict(db, model.User, {"email": form.email})

    # Only send a mail for existing, active accounts, but always return 204 so
    # the endpoint does not reveal which email addresses are registered.
    if user and user.is_active:
        try:
            token = methods.issue_password_reset_token(str(user.id))
            html = get_password_reset_mail_html(token)
            message = MessageSchema(
                subject="StudyAlign password reset",
                recipients=[user.email],
                body=html,
                subtype=MessageType.html)
            fm = FastMail(email_config)
            await fm.send_message(message)
        except Exception as e:
            # Never surface mail failures: they would reveal which emails exist.
            logger.error("Failed to send password reset mail: %s", e)

    return


@router.post("/users/reset-password", response_model=schema.user.User)
async def reset_password(form: schema.user.ResetPasswordForm, db: Session = Depends(get_db)):
    user_id = methods.read_password_reset_token(form.token)
    if user_id is None:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    user = methods.read(db, model.User, int(user_id))
    if_exists(user, ENTITY)

    user.password = get_password_hash(form.password)
    db.commit()
    db.refresh(user)

    return user