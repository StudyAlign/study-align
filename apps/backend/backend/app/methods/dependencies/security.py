from typing import List
from uuid import UUID

from fastapi import HTTPException, Depends, status, Header, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
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


class TokenValidator:
    def __init__(self, type: str = None, admin: bool = False, role: List[str] = []):
        self.type = type
        self.admin = admin
        self.role = role

    def __call__(self, auth_credentials: HTTPAuthorizationCredentials = Depends(auth_scheme),
                 db: Session = Depends(get_db)):
        refresh = methods.REFRESH
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
        try:
            token = auth_credentials.credentials
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        except ExpiredSignatureError:
            raise credentials_exception
        except JWTError:
            raise credentials_exception

        if self.type is None and refresh in payload:
            raise credentials_exception
        if self.type == refresh and (refresh not in payload or payload.get(methods.REFRESH) is None or payload.get(methods.REFRESH) is False):
            raise credentials_exception

        role = payload.get('role')

        if role not in self.role:
            raise credentials_exception

        if role == "admin":
            api_admin_key: str = payload.get("sub")
            if api_admin_key is None:
                raise credentials_exception
            token_data = TokenData(api_admin_key=api_admin_key)
            if token_data.api_admin_key != API_ADMIN_KEY:
                raise credentials_exception
            return Admin(api_key=token_data.api_admin_key)

        if role == "participant":
            participant_token: str = payload.get("sub")
            if participant_token is None:
                raise credentials_exception
            try:
                UUID(str(participant_token))
            except ValueError:
                raise credentials_exception
            token_data = TokenData(participant_token=participant_token)
            participant = methods.read_by(db, model.Participant, "token", token_data.participant_token)
            if participant is None or participant.state != "in_progress":
                raise credentials_exception
            return participant

        raise credentials_exception
