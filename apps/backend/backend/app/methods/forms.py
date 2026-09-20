"""Native questionnaire (Form) helpers: templates, copy-on-use, validation."""
import copy

from fastapi import HTTPException
from starlette import status
from sqlalchemy.orm import Session

import model


# ── Template definitions ──────────────────────────────────────────────────────
# Seeded as global templates. Used by deep copy, so later edits to a template do
# not affect questionnaires already placed in studies.

_LIKERT_5 = [
    {"value": 1, "label": "Strongly disagree"},
    {"value": 2, "label": "Disagree"},
    {"value": 3, "label": "Neutral"},
    {"value": 4, "label": "Agree"},
    {"value": 5, "label": "Strongly agree"},
]

_SUS_ITEMS = [
    "I think that I would like to use this system frequently.",
    "I found the system unnecessarily complex.",
    "I thought the system was easy to use.",
    "I think that I would need the support of a technical person to be able to use this system.",
    "I found the various functions in this system were well integrated.",
    "I thought there was too much inconsistency in this system.",
    "I would imagine that most people would learn to use this system very quickly.",
    "I found the system very cumbersome to use.",
    "I felt very confident using the system.",
    "I needed to learn a lot of things before I could get going with this system.",
]

_UEQ_S_PAIRS = [
    ("obstructive", "supportive"),
    ("complicated", "easy"),
    ("inefficient", "efficient"),
    ("confusing", "clear"),
    ("boring", "exciting"),
    ("not interesting", "interesting"),
    ("conventional", "inventive"),
    ("usual", "leading edge"),
]

_TLX_DIMENSIONS = [
    ("mental", "Mental demand", "Low", "High"),
    ("physical", "Physical demand", "Low", "High"),
    ("temporal", "Temporal demand", "Low", "High"),
    ("performance", "Performance", "Good", "Poor"),
    ("effort", "Effort", "Low", "High"),
    ("frustration", "Frustration", "Low", "High"),
]


def _demographics_definition():
    return {
        "settings": {"allow_back": True, "show_progress": True, "randomize_pages": False},
        "pages": [{
            "id": "p1", "title": "About you", "randomize_items": False,
            "items": [
                {"id": "i_age", "type": "number", "key": "age", "label": "Age",
                 "required": True, "config": {"min": 0, "max": 120, "step": 1}},
                {"id": "i_gender", "type": "choice", "key": "gender", "label": "Gender",
                 "required": True,
                 "config": {"multiple": False, "render": "radio", "options": [
                     {"value": "female", "label": "Female"},
                     {"value": "male", "label": "Male"},
                     {"value": "non_binary", "label": "Non-binary"},
                     {"value": "self_describe", "label": "Prefer to self-describe"},
                     {"value": "no_answer", "label": "Prefer not to say"},
                 ]}},
                {"id": "i_education", "type": "choice", "key": "education",
                 "label": "Highest level of education", "required": False,
                 "config": {"multiple": False, "render": "dropdown", "options": [
                     {"value": "secondary", "label": "Secondary school"},
                     {"value": "bachelor", "label": "Bachelor's degree"},
                     {"value": "master", "label": "Master's degree"},
                     {"value": "phd", "label": "Doctorate"},
                     {"value": "other", "label": "Other"},
                 ]}},
                {"id": "i_field", "type": "text", "key": "field_of_work",
                 "label": "Field of study or work", "required": False,
                 "config": {"multiline": False}},
            ],
        }],
    }


def _sus_definition():
    rows = [{"key": "sus_%d" % (i + 1), "text": text} for i, text in enumerate(_SUS_ITEMS)]
    return {
        "settings": {"allow_back": True, "show_progress": True, "randomize_pages": False},
        "pages": [{
            "id": "p1", "title": "System Usability Scale", "randomize_items": False,
            "items": [
                {"id": "i_intro", "type": "display",
                 "html": "<p>Please rate your agreement with the following statements.</p>"},
                {"id": "i_sus", "type": "scale", "key": "sus",
                 "label": "System Usability Scale", "required": True,
                 "config": {"points": _LIKERT_5, "rows": rows, "randomize_rows": False,
                            "bipolar": False, "left": None, "right": None}},
            ],
        }],
    }


def _ueq_s_definition():
    points = [{"value": v, "label": ""} for v in range(1, 8)]  # 7-point, unlabeled
    rows = [{"key": "ueq_%d" % (i + 1), "left": left, "right": right}
            for i, (left, right) in enumerate(_UEQ_S_PAIRS)]
    return {
        "settings": {"allow_back": True, "show_progress": True, "randomize_pages": False},
        "pages": [{
            "id": "p1", "title": "User Experience Questionnaire (short)", "randomize_items": False,
            "items": [
                {"id": "i_intro", "type": "display",
                 "html": "<p>Please rate the product on each pair of terms.</p>"},
                {"id": "i_ueq", "type": "scale", "key": "ueq",
                 "label": "UEQ-S", "required": True,
                 "config": {"points": points, "rows": rows, "randomize_rows": False,
                            "bipolar": True}},
            ],
        }],
    }


def _nasa_tlx_definition():
    # First version: discrete 0-100 (step 5) bipolar scale. Phase 2 replaces this
    # with continuous sliders.
    points = [{"value": v, "label": str(v) if v in (0, 100) else ""} for v in range(0, 101, 5)]
    rows = [{"key": "tlx_%s" % key, "left": low, "right": high, "text": label}
            for (key, label, low, high) in _TLX_DIMENSIONS]
    return {
        "settings": {"allow_back": True, "show_progress": True, "randomize_pages": False},
        "pages": [{
            "id": "p1", "title": "NASA-TLX (Raw)", "randomize_items": False,
            "items": [
                {"id": "i_intro", "type": "display",
                 "html": "<p>Rate the workload you experienced on each dimension.</p>"},
                {"id": "i_tlx", "type": "scale", "key": "tlx",
                 "label": "NASA-TLX", "required": True,
                 "config": {"points": points, "rows": rows, "randomize_rows": False,
                            "bipolar": True}},
            ],
        }],
    }


TEMPLATES = [
    {"slug": "demographics", "name": "Demographics",
     "description": "Age, gender, education, and field.", "builder": _demographics_definition},
    {"slug": "sus", "name": "System Usability Scale (SUS)",
     "description": "The 10-item SUS, 5-point agreement.", "builder": _sus_definition},
    {"slug": "ueq-s", "name": "User Experience Questionnaire (UEQ-S)",
     "description": "8 semantic-differential pairs, 7-point.", "builder": _ueq_s_definition},
    {"slug": "nasa-tlx", "name": "NASA-TLX (Raw)",
     "description": "Six workload dimensions, 0-100 (discrete; sliders later).",
     "builder": _nasa_tlx_definition},
]


def seed_form_templates(db: Session):
    """Insert any missing global templates. Idempotent (keyed by slug)."""
    created = 0
    for tpl in TEMPLATES:
        existing = db.query(model.Form).filter(model.Form.slug == tpl["slug"]).one_or_none()
        if existing is not None:
            continue
        db.add(model.Form(
            name=tpl["name"], description=tpl["description"], definition=tpl["builder"](),
            is_template=True, is_global=True, slug=tpl["slug"], version=1,
        ))
        created += 1
    if created:
        db.commit()
    return created


# ── Copy-on-use ───────────────────────────────────────────────────────────────

def copy_template(db: Session, template: model.Form, study_id: int, owner_id=None):
    """Deep-copy a template into a new study-scoped questionnaire."""
    new_form = model.Form(
        name=template.name,
        description=template.description,
        definition=copy.deepcopy(template.definition or {}),
        is_template=False,
        is_global=False,
        slug=None,
        version=1,
        owner_id=owner_id,
        study_id=study_id,
    )
    db.add(new_form)
    db.commit()
    db.refresh(new_form)
    return new_form


# ── Validation ────────────────────────────────────────────────────────────────

def _iter_items(definition):
    for page in (definition or {}).get("pages", []):
        for item in page.get("items", []):
            yield item


def _is_empty(value):
    if value is None:
        return True
    if isinstance(value, str) and value.strip() == "":
        return True
    if isinstance(value, (list, dict)) and len(value) == 0:
        return True
    return False


def validate_required(definition, answers):
    """Return a list of missing required keys. Empty list means valid."""
    answers = answers or {}
    missing = []
    for item in _iter_items(definition):
        if not item.get("required"):
            continue
        item_type = item.get("type")
        if item_type == "display":
            continue
        if item_type == "scale":
            for row in item.get("config", {}).get("rows", []):
                if _is_empty(answers.get(row.get("key"))):
                    missing.append(row.get("key"))
        else:
            key = item.get("key")
            if key and _is_empty(answers.get(key)):
                missing.append(key)
    return missing


# ── Response upsert ───────────────────────────────────────────────────────────

def upsert_response(db: Session, form: model.Form, participant, upsert):
    """Create or update the participant's response to a form (autosave/submit)."""
    if upsert.submitted:
        missing = validate_required(form.definition, upsert.answers)
        if missing:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail={"message": "Required answers are missing.", "missing": missing},
            )

    response = db.query(model.FormResponse).filter(
        model.FormResponse.form_id == form.id,
        model.FormResponse.participant_id == participant.id,
    ).one_or_none()

    if response is None:
        response = model.FormResponse(
            form_id=form.id,
            participant_id=participant.id,
            study_id=form.study_id,
            form_version=form.version,
            answers=upsert.answers or {},
            submitted=upsert.submitted,
        )
        db.add(response)
    else:
        response.answers = upsert.answers or {}
        response.form_version = form.version
        if upsert.submitted:
            response.submitted = True
    db.commit()
    db.refresh(response)
    return response
