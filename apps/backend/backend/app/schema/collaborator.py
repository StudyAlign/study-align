from typing import Optional, Literal

from pydantic import BaseModel, Field


class CollaboratorBase(BaseModel):
    study_id: int
    user_id: int

    class Config:
        from_attributes = True


class CollaboratorCreate(CollaboratorBase):
    pass


class CollaboratorPatch(BaseModel):
    study_id: Optional[int] = None
    user_id: Optional[int]= None

    class Config:
        extra = 'forbid'


class Collaborator(CollaboratorBase):
    id: int

    class Config:
        from_attributes = True
