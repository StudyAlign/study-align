from enum import Enum
import uuid
from typing import Optional
from pydantic import BaseModel


class GroupInviteBase(BaseModel):
    group_id: int
    user_id: int
    invited_by_id: int


class GroupInviteCreate(GroupInviteBase):
    pass


class GroupInvite(GroupInviteBase):
    id: int
    token: uuid.UUID

    class Config:
        from_attributes = True