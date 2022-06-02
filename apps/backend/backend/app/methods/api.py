from datetime import datetime, timedelta
from enum import Enum
from typing import Optional

import model
from fastapi import HTTPException, Depends
from jose import jwt

from decouple import config

from methods.dependencies.security import LoggerKeyValidator, ParticipantValidator, UserValidator

SECRET_KEY = config('SECRET_KEY')
ALGORITHM = config('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', cast=int)
API_ADMIN_KEY = config('API_ADMIN_KEY')

REFRESH = "refresh"

#USER_LOGIN => username + password
#PARTICIPANT_KEY => participant uuid
class AuthMethod(str, Enum):
    PARTICIPANT_KEY = "PARTICIPANT_KEY"
    USER_LOGIN = "USER_LOGIN"

class UserRole(str, Enum):
    ADMIN = "admin"
    RESEARCHER = "researcher"
    STUDENT = "student"

userAccessTokenValidator = UserValidator(strict_auth_method=True, user_role=[UserRole.ADMIN, UserRole.RESEARCHER])
userRefreshTokenValidator = UserValidator(type=REFRESH, strict_auth_method=True, user_role=[UserRole.ADMIN, UserRole.RESEARCHER])

participantLoggerKeyValidator = LoggerKeyValidator()


async def get_active_participant(participant: model.Participant = Depends(ParticipantValidator())):
    return participant


async def get_active_logger_participant(participant: model.Participant = Depends(participantLoggerKeyValidator)):
    if participant.state != "in_progress":
        raise HTTPException(status_code=400, detail="Inactive participant")
    return participant


def issue_access_token(sub: str, auth_method: str):
    access_token = create_access_token(sub, auth_method)
    return {"access_token": access_token, "token_type": "bearer"}


def issue_tokens(sub: str, end_date: datetime, auth_method: str):
    access_token = create_access_token(sub, auth_method)
    refresh_token = create_refresh_token(sub, auth_method, end_date)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


def create_access_token(sub: str, auth_method: str):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _create_token(
        data={
            "sub": sub,
            "auth_method": auth_method
        }, expires_delta=access_token_expires
    )
    return access_token


# refresh tokens expire with end of study
def create_refresh_token(sub: str, auth_method: str, end_date: datetime):
    delta = end_date - datetime.utcnow()
    refresh_token_expires = delta.total_seconds() / 60
    data = {
        "sub": sub,
        "auth_method": auth_method,
        "refresh": True,
    }
    refresh_token = _create_token(
        data=data, expires_delta=timedelta(minutes=refresh_token_expires)
    )
    return refresh_token


def _create_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
