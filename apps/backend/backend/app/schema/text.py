from typing import Optional, Literal

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
        from_attributes = True


class TextStep(Text):
    procedure_step_type: str = Literal["text"]
    is_last_step: Optional[bool] = False
    is_second_last_step: Optional[bool] = False