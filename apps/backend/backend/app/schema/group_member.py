from typing import Optional, Literal

from pydantic import BaseModel, Field


class GroupMemberBase(BaseModel):
    group_id: int
    user_id: int

    class Config:
        from_attributes = True


class GroupMemberCreate(GroupMemberBase):
    pass


class GroupMemberPatch(BaseModel):
    group_id: Optional[int] = None
    user_id: Optional[int]= None

    class Config:
        extra = 'forbid'


class GroupMember(GroupMemberBase):
    id: int

    class Config:
        from_attributes = True
