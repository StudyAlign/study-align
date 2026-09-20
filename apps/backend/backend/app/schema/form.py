from typing import Optional, Any, Dict
from datetime import datetime

from pydantic import BaseModel


# ── Form (native questionnaire definition) ────────────────────────────────────

class FormBase(BaseModel):
    name: str
    description: Optional[str] = None
    # The whole questionnaire structure (settings + pages + items).
    definition: Dict[str, Any] = {}

    class Config:
        from_attributes = True


class FormCreate(FormBase):
    study_id: Optional[int] = None


class FormPatch(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    definition: Optional[Dict[str, Any]] = None

    class Config:
        extra = 'forbid'


class Form(FormBase):
    id: int
    is_template: bool
    is_global: bool
    slug: Optional[str] = None
    version: int
    owner_id: Optional[int] = None
    study_id: Optional[int] = None

    class Config:
        from_attributes = True


class FormExport(BaseModel):
    """Embedded in a study export so native questionnaires travel with the study
    and are recreated on import."""
    name: str
    definition: Dict[str, Any] = {}
    version: Optional[int] = 1

    class Config:
        from_attributes = True


class FormSummary(BaseModel):
    """Lightweight listing item (no full definition)."""
    id: int
    name: str
    description: Optional[str] = None
    is_template: bool
    slug: Optional[str] = None
    version: int
    study_id: Optional[int] = None

    class Config:
        from_attributes = True


# ── Responses ─────────────────────────────────────────────────────────────────

class FormResponseUpsert(BaseModel):
    answers: Dict[str, Any] = {}
    submitted: bool = False


class FormResponse(BaseModel):
    id: int
    form_id: int
    participant_id: int
    study_id: Optional[int] = None
    form_version: Optional[int] = None
    answers: Dict[str, Any] = {}
    submitted: bool
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
