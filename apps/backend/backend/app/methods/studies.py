from fastapi import HTTPException
from sqlalchemy.orm import Session

import model

import methods
from api.utils import if_exists
from methods.procedure_configs import _iterate_procedure_config_steps_import
from schema.study import StudyImport, StudyDuplicate, StudyDetails


def check_if_study_exists(db: Session, study_id: int):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    return study

def check_if_study_running(db: Session, study_id: int):
    study = methods.read(db, model.Study, study_id)
    if study.state == "running":
        raise HTTPException(status_code=403, detail="Study is running")


def import_study(db: Session, import_study: StudyImport, owner_id: int):
    bulk_insert = []

    study = model.Study(**import_study.study.model_dump())
    study.owner_id = owner_id
    study.state = "setup"
    study.current_setup_step = "study"
    study.name = study.name + " IMPORTED"
    bulk_insert.append(study)
    procedure_config_main = model.ProcedureConfig(study=study, main=True)
    bulk_insert.append(procedure_config_main)

    bulk_insert = _iterate_procedure_config_steps_import(db, bulk_insert, study, procedure_config_main, import_study.procedure_config.procedure_config_steps)
    db.add_all(bulk_insert)
    db.commit()
    db.refresh(study)
    return study


def duplicate_study(db: Session, duplicate_study: StudyDuplicate):
    bulk_insert = []

    study = model.Study(**duplicate_study["study"].model_dump())
    study.state = "setup"
    study.current_setup_step = "study"
    study.name = study.name + " DUPLICATED"

    procedure_config_main = model.ProcedureConfig(study=study, main=True)
    bulk_insert.append(procedure_config_main)

    bulk_insert = _iterate_procedure_config_steps_import(db, bulk_insert, study, procedure_config_main, duplicate_study["procedure_config"].procedure_config_steps)
    db.add_all(bulk_insert)
    db.commit()
    db.refresh(study)
    return study


def compute_participant_counts(db: Session, study: StudyDetails):
    remaining_participants_count = methods.count_by_dict(db, model.Participant, {"study_id": study.id, "state": "free"})
    in_progress_participants_count = methods.count_by_dict(db, model.Participant, {"study_id": study.id, "state": "in_progress"})
    done_participants_count = methods.count_by_dict(db, model.Participant, {"study_id": study.id, "state": "finished"})
    total_participants_count = db.query(model.Participant).filter(model.Participant.study_id == study.id).count()

    study.remaining_participants = remaining_participants_count
    study.in_progress_participants = in_progress_participants_count
    study.done_participants = done_participants_count
    study.total_participants = total_participants_count
    return study