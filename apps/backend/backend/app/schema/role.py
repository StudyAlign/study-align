from enum import Enum
from typing import Union
from pydantic import BaseModel

class RoleEnum(str, Enum):
    admin = "admin"
    researcher = "researcher"
    student = "student"

class RoleBase(BaseModel):
    name: RoleEnum
    # rights: Union[dict, list, set, float, int, str, bytes, bool]

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int

    class Config:
        orm_mode = True
