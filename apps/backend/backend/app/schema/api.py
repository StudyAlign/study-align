from typing import Optional

from pydantic import BaseModel


class Tokens(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str


class AccessToken(BaseModel):
    access_token: str
    token_type: str


class RefreshToken(BaseModel):
    refresh_token: str
    token_type: str


class TokenData(BaseModel):
    participant_token: Optional[str] = None
    api_admin_key: Optional[str] = None
    user_name: Optional[str] = None


class Admin(BaseModel):
    api_key: str

