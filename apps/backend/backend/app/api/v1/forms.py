from fastapi import Depends, APIRouter, HTTPException
from typing import List

from starlette import status

from methods import UserValidator, UserRole
from methods.dependencies.roles import is_allowed
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model
import methods
import schema.form

router = APIRouter()

ENTITY = "Form"


def _get_form_or_404(db, form_id):
    form = methods.read(db, model.Form, form_id)
    if_exists(form, ENTITY)
    return form


def _is_admin(user):
    return getattr(user, "role", None) is not None and user.role.name == UserRole.ADMIN


def _assert_can_read(db, form, user):
    """Templates are readable by anyone. Study forms require study access.
    A user's own global questionnaires are readable by the owner (or an admin)."""
    if form.is_template:
        return
    if form.study_id is not None:
        study = methods.read(db, model.Study, form.study_id)
        if_exists(study, "Study")
        is_allowed(study, user, ENTITY)
        return
    # Global questionnaire (no study).
    if form.owner_id == user.id or _is_admin(user):
        return
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not allowed to access this questionnaire.")


def _assert_can_write(db, form, user):
    """Study forms are writable with study access (and only while not running).
    Global questionnaires are writable by their owner; templates by admins."""
    if form.study_id is not None:
        study = methods.read(db, model.Study, form.study_id)
        if_exists(study, "Study")
        is_allowed(study, user, ENTITY)
        methods.check_if_study_running(db, form.study_id)
        return
    if form.is_template and not _is_admin(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only admins can edit templates.")
    if form.owner_id is not None and form.owner_id != user.id and not _is_admin(user):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not the owner of this questionnaire.")


# ── Templates ─────────────────────────────────────────────────────────────────

@router.get("/forms/templates", response_model=List[schema.form.FormSummary],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def list_form_templates(db: Session = Depends(get_db)):
    return db.query(model.Form).filter(model.Form.is_template.is_(True)).all()


@router.get("/forms/global/usage", dependencies=[Depends(methods.userAccessTokenValidator)])
async def global_forms_usage(user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                             db: Session = Depends(get_db)):
    """For each of the user's global questionnaires, the studies that use it
    (a study uses it when a native step's source_form_id points at it)."""
    forms = db.query(model.Form).filter(
        model.Form.study_id.is_(None),
        model.Form.is_template.is_(False),
        model.Form.owner_id == user.id,
    ).order_by(model.Form.name.asc()).all()
    result = []
    for f in forms:
        study_ids = sorted({
            q.study_id for q in db.query(model.Questionnaire).filter(
                model.Questionnaire.source_form_id == f.id).all()
            if q.study_id is not None
        })
        studies = db.query(model.Study).filter(model.Study.id.in_(study_ids)).all() if study_ids else []
        result.append({
            "form_id": f.id,
            "form_name": f.name,
            "studies": [{"id": s.id, "name": s.name} for s in studies],
        })
    return result


@router.post("/forms/from-template/{template_id}", response_model=schema.form.Form,
             dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_form_from_template(template_id: int, study_id: int,
                                    user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                                    db: Session = Depends(get_db)):
    template = _get_form_or_404(db, template_id)
    if not template.is_template:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Not a template.")
    study = methods.check_if_study_exists(db, study_id)
    is_allowed(study, user, ENTITY)
    methods.check_if_study_running(db, study_id)
    return methods.copy_template(db, template, study_id, owner_id=user.id)


# ── Study questionnaires (researcher) ─────────────────────────────────────────

@router.get("/studies/{study_id}/forms", response_model=List[schema.form.FormSummary],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def list_study_forms(study_id: int,
                           user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                           db: Session = Depends(get_db)):
    study = methods.check_if_study_exists(db, study_id)
    is_allowed(study, user, ENTITY)
    return db.query(model.Form).filter(model.Form.study_id == study_id).all()


@router.get("/forms/global", response_model=List[schema.form.FormSummary],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def list_global_forms(user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                            db: Session = Depends(get_db)):
    """The current user's own global questionnaires (reusable across studies)."""
    return db.query(model.Form).filter(
        model.Form.study_id.is_(None),
        model.Form.is_template.is_(False),
        model.Form.owner_id == user.id,
    ).all()


@router.post("/forms", response_model=schema.form.Form,
             dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_form(form: schema.form.FormCreate,
                      user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                      db: Session = Depends(get_db)):
    data = form.dict()
    data["owner_id"] = user.id
    if form.study_id is None:
        # Global questionnaire, reusable across studies and selectable in the
        # procedure editor.
        data["is_global"] = True
    else:
        study = methods.check_if_study_exists(db, form.study_id)
        is_allowed(study, user, ENTITY)
        methods.check_if_study_running(db, form.study_id)
    return methods.create(db, model.Form, data)


@router.get("/forms/{form_id}", response_model=schema.form.Form,
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_form(form_id: int,
                    user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                    db: Session = Depends(get_db)):
    form = _get_form_or_404(db, form_id)
    _assert_can_read(db, form, user)
    return form


@router.patch("/forms/{form_id}", response_model=schema.form.Form,
              dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_form(form_id: int, patch: schema.form.FormPatch,
                      user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                      db: Session = Depends(get_db)):
    form = _get_form_or_404(db, form_id)
    _assert_can_write(db, form, user)
    if patch.name is not None:
        form.name = patch.name
    if patch.description is not None:
        form.description = patch.description
    if patch.definition is not None:
        form.definition = patch.definition
        # Bump the version so stored responses stay interpretable.
        form.version = (form.version or 1) + 1
    db.commit()
    db.refresh(form)
    return form


@router.delete("/forms/{form_id}", status_code=status.HTTP_204_NO_CONTENT,
               dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_form(form_id: int,
                      user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                      db: Session = Depends(get_db)):
    form = _get_form_or_404(db, form_id)
    _assert_can_write(db, form, user)
    db.delete(form)
    db.commit()
    return


@router.get("/studies/{study_id}/form-responses", response_model=List[schema.form.FormResponse],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def list_study_form_responses(study_id: int,
                                    user: schema.user.User = Depends(UserValidator(strict_auth_method=True)),
                                    db: Session = Depends(get_db)):
    study = methods.check_if_study_exists(db, study_id)
    is_allowed(study, user, ENTITY)
    return db.query(model.FormResponse).filter(model.FormResponse.study_id == study_id).all()


# ── Participant flow ──────────────────────────────────────────────────────────

@router.get("/forms/{form_id}/participant")
async def read_form_for_participant(form_id: int,
                                    participant: model.Participant = Depends(methods.get_active_participant),
                                    db: Session = Depends(get_db)):
    """Return the definition plus this participant's saved answers (resume)."""
    if participant is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Participant token required.")
    form = _get_form_or_404(db, form_id)
    if form.study_id is not None and participant.study_id != form.study_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Form not in participant's study.")
    response = db.query(model.FormResponse).filter(
        model.FormResponse.form_id == form.id,
        model.FormResponse.participant_id == participant.id,
    ).one_or_none()
    return {
        "form": {"id": form.id, "name": form.name, "version": form.version,
                 "definition": form.definition},
        "response": {"answers": response.answers if response else {},
                     "submitted": response.submitted if response else False},
    }


@router.put("/forms/{form_id}/participant", response_model=schema.form.FormResponse)
async def upsert_form_response(form_id: int, upsert: schema.form.FormResponseUpsert,
                               participant: model.Participant = Depends(methods.get_active_participant),
                               db: Session = Depends(get_db)):
    if participant is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Participant token required.")
    form = _get_form_or_404(db, form_id)
    if form.study_id is not None and participant.study_id != form.study_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Form not in participant's study.")
    return methods.upsert_response(db, form, participant, upsert)
