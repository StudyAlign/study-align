from typing import List
from uuid import UUID

from fastapi import HTTPException, Depends, status, Header, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, APIKeyHeader
from jose import JWTError, jwt, ExpiredSignatureError
from decouple import config

import methods
from model.base import Session
import model

from schema.api import TokenData, Admin

from api import get_db

SECRET_KEY = config('SECRET_KEY')
ALGORITHM = config('ALGORITHM')
ACCESS_TOKEN_EXPIRE_MINUTES = config('ACCESS_TOKEN_EXPIRE_MINUTES', cast=int)
API_ADMIN_KEY = config('API_ADMIN_KEY')
auth_scheme = HTTPBearer()


def get_payload_jwt(auth_credentials: HTTPAuthorizationCredentials = Depends(auth_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        token = auth_credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except ExpiredSignatureError as e:
        print(e)
        raise credentials_exception
    except JWTError as e:
        print(e)
        raise credentials_exception
    return payload


def check_token_type(payload: dict, type: str = None):
    refresh = methods.REFRESH
    if type is None and refresh in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token cannot be used for authentication",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if type == refresh and (
            refresh not in payload or payload.get(refresh) is None or payload.get(refresh) is False):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token needed",
            headers={"WWW-Authenticate": "Bearer"},
        )


def check_auth_method(payload: dict, allowed_auth_methods: List[str] = []):
    auth_method = payload.get('auth_method')
    if allowed_auth_methods and auth_method not in allowed_auth_methods:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Auth method " + auth_method + " not allowed",
            headers={"WWW-Authenticate": "Bearer"},
        )


# JWTValidator is a generic check for a valid JWT. It does not check for participant or user credentials
class JWTValidator:
    def __init__(self, type: str = None, auth_method: List[str] = []):
        self.type = type
        self.auth_method = auth_method

    def __call__(self, payload: dict = Depends(get_payload_jwt), db: Session = Depends(get_db)):
        check_token_type(payload, self.type)
        check_auth_method(payload, self.auth_method)
        return payload


class UserValidator:
    def __init__(self, type: str = None, strict_auth_method: bool = False, user_role: List[str] = []):
        self.type = type
        self.strict_auth_method = strict_auth_method
        self.user_role = user_role

    def __call__(self, payload: dict = Depends(get_payload_jwt), db: Session = Depends(get_db)):
        check_token_type(payload, self.type)

        if methods.AuthMethod(payload.get("auth_method")) is not methods.AuthMethod.USER_LOGIN:
            if self.strict_auth_method:
                check_auth_method(payload, [methods.AuthMethod.USER_LOGIN])
            return None


        print(payload)
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not retrieve user",
                headers={"WWW-Authenticate": "Bearer"},
            )

        user = methods.read_by(db, model.User, "id", user_id)
        if user is None or not user.isActive:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive user",
                headers={"WWW-Authenticate": "Bearer"},
            )

        if self.user_role and user.role.name not in self.user_role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User role not sufficient",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user


class ParticipantValidator:
    def __init__(self, type: str = None, strict_auth_method: bool = False):
        self.type = type
        self.strict_auth_method = strict_auth_method

    def __call__(self, payload: dict = Depends(get_payload_jwt), db: Session = Depends(get_db)):
        check_token_type(payload, self.type)

        if methods.AuthMethod(payload.get("auth_method")) is not methods.AuthMethod.PARTICIPANT_KEY:
            if self.strict_auth_method:
                check_auth_method(payload, [methods.AuthMethod.USER_LOGIN])
            return None

        participant_token: str = payload.get("sub")
        if participant_token is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not retrieve participant token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        try:
            UUID(str(participant_token))
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Participant token no valid UUID",
                headers={"WWW-Authenticate": "Bearer"},
            )

        participant = methods.read_by(db, model.Participant, "token", participant_token)
        if participant is None or participant.state != "in_progress":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Inactive participant",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return participant


LOGGER_API_KEY = APIKeyHeader(name='Studyalign-Logger-Key')
class LoggerKeyValidator:
    def __call__(self, logger_api_key: str = Depends(LOGGER_API_KEY),
                 db: Session = Depends(get_db)):

        key_format_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Logger api key format is wrong"
        )

        try:
            UUID(logger_api_key, version=4)
        except ValueError:
            raise key_format_exception

        key_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate logger api key"
        )
        participant = methods.read_by(db, model.Participant, "logger_key", logger_api_key)
        if participant is None or participant.state != "in_progress":
            raise key_exception
        return participant
