from datetime import datetime, timedelta
from enum import Enum
from typing import Optional

from model.base import Base

import model
from fastapi import HTTPException, Depends
from jose import jwt

from decouple import config

from methods.dependencies.security import TokenValidator


SECRET_KEY = config('SECRET_KEY')
ALGORITHM = config('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', cast=int)
API_ADMIN_KEY = config('API_ADMIN_KEY')

REFRESH = "refresh"


class Role(str, Enum):
    ADMIN = "admin"
    PARTICIPANT = "participant"


participantAccessTokenValidator = TokenValidator(role=[Role.PARTICIPANT])
participantRefreshTokenValidator = TokenValidator(type=REFRESH, role=[Role.PARTICIPANT])

adminAccessTokenValidator = TokenValidator(role=[Role.ADMIN])
adminRefreshTokenValidator = TokenValidator(type=REFRESH, role=[Role.ADMIN])

switchAccessTokenValidator = TokenValidator(role=[Role.ADMIN, Role.PARTICIPANT])


def check_admin_key(api_key: str):
    if api_key != API_ADMIN_KEY:
        raise HTTPException(status_code=401, detail="API key invalid")


async def get_active_participant(participant: model.Participant = Depends(participantAccessTokenValidator)):
    if participant.state != "in_progress":
        raise HTTPException(status_code=400, detail="Inactive participant")
    return participant


async def access_switch_participant(participant: Base = Depends(switchAccessTokenValidator)):
    if isinstance(participant, model.Participant) and participant.state is "in_progress":
        return participant


def issue_access_token(sub: str, role: str):
    access_token = create_access_token(sub, role)
    return {"access_token": access_token, "token_type": "bearer"}


def issue_tokens(sub: str, end_date: datetime, role: str,):
    access_token = create_access_token(sub, role)
    refresh_token = create_refresh_token(sub, role, end_date)
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


def create_access_token(sub: str, role: str):
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = _create_token(
        data={
            "sub": sub,
            "role": role
        }, expires_delta=access_token_expires
    )
    return access_token


# refresh tokens expire with end of study
def create_refresh_token(sub: str, role: str, end_date: datetime):
    delta = end_date - datetime.utcnow()
    refresh_token_expires = delta.total_seconds() / 60
    data = {
        "sub": sub,
        "role": role,
        "refresh": True,
    }
    refresh_token = _create_token(
        data=data, expires_delta=timedelta(minutes=refresh_token_expires)
    )

    print("REFRESH TOKEN")
    print(data)
    print(str(timedelta(minutes=refresh_token_expires)))
    print(refresh_token)
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
