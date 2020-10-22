from typing import Optional

from pydantic import BaseModel, Field


class TextBase(BaseModel):
    title: str
    body: str


class TextCreate(TextBase):
    study_id: int
    pass


class TextPatch(BaseModel):
    title: Optional[str]
    body: Optional[str]

    class Config:
        extra = 'forbid'


class Text(TextBase):
    id: int

    study_id: int

    class Config:
        orm_mode = True


class TextStep(Text):
    procedure_step_type: str = Field("text", const=True)