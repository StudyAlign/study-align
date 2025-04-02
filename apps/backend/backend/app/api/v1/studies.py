from datetime import datetime
from uuid import UUID

from fastapi import Depends, APIRouter, status, HTTPException
from typing import List, Union, Literal

from sqlalchemy import or_

from methods.dependencies.roles import StudyIdRoleCheck
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

from methods import AuthMethod, UserRole, UserValidator

import schema.study
import schema.procedure
import schema.api
from schema.participant import ParticipantEnum, ParticipantOrderByFields
from schema.questionnaire import QuestionnaireSystemEnum

router = APIRouter()

ENTITY = "Study"

@router.get("/studies", response_model=List[schema.study.StudyDetails], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_studies(user: schema.user.User = Depends(UserValidator(strict_auth_method=True)), db: Session = Depends(get_db)):
    if user.role.name == UserRole.RESEARCHER:
        return db.query(model.Study).join(model.Collaborator).filter(or_(model.Study.owner_id == user.id, model.Collaborator.user_id == user.id)).order_by(model.Study.id.desc()).all()
    return methods.read_list(db, model.Study)


@router.post("/studies", response_model=schema.study.StudyDetails, dependencies=[Depends(methods.userAccessTokenValidator)])
async def create_study(study: schema.study.StudyCreate, db: Session = Depends(get_db)):
    created_study = methods.create(db, model.Study, study)
    # Create a ProcedureConfig right away
    methods.create(db, model.ProcedureConfig, {"study_id": created_study.id, "main": True})
    return created_study


@router.get("/studies/{study_id}", response_model=schema.study.StudyDetails)
async def read_study(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    return study


StudyIdCheck = Depends(StudyIdRoleCheck())
@router.patch("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_study(study_id: int = StudyIdCheck, study: schema.study.StudyUpdate = None, db: Session = Depends(get_db)):
    study_update = methods.patch(db, model.Study, study, study_id)
    if_not_zero(study_update, ENTITY)
    return study_update


@router.delete("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_study(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    db.delete(study)
    db.commit()
    return


@router.get("/studies/{study_id}/setup-info", response_model=schema.study.StudySetupInfo, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_study_setup_info(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    remaining_participants_count = methods.count_by_dict(db, model.Participant, {"study_id": study_id, "state": "free"})
    study.remaining_participants = remaining_participants_count
    return study


@router.get("/studies/{study_id}/procedure-config", response_model=schema.procedure_config.ProcedureConfig, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_procedure_config_main(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    procedure_config_main = methods.read_by_dict(db, model.ProcedureConfig, {"study_id": study_id, "main": True})
    return procedure_config_main


@router.post("/studies/{study_id}/procedures", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def generate_procedures(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    procedures = methods.read_list_by(db, model.Procedure, "study_id", study_id)
    if procedures:
        raise HTTPException(status_code=409, detail="Procedures have already been generated")
    return methods.create_procedures(db, study_id)


@router.post("/studies/{study_id}/participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def generate_participants(study_id: int = StudyIdCheck, amount: int = 10, db: Session = Depends(get_db)):
    participant_count = methods.count_by(db, model.Participant, "study_id", study_id)
    if participant_count != 0:
        raise HTTPException(status_code=409, detail="Participants have already been generated")
    return methods.create_participants(db, study_id, amount)


@router.post("/studies/{study_id}/add-participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def add_participants(study_id: int = StudyIdCheck, amount: int = 10, db: Session = Depends(get_db)):
    participant_count = methods.count_by(db, model.Participant, "study_id", study_id)
    if participant_count == 0:
        raise HTTPException(status_code=409, detail="Generate participants first")
    return methods.add_participants(db, study_id, amount)


@router.get("/studies/{study_id}/participants", response_model=List[schema.populated.ParticipantPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_participants(study_id: int = StudyIdCheck, participant_state: Union[ParticipantEnum, None] = None,
                            paused: Union[bool, None] = None, proceed: Union[bool, None] = None, offset: int = 0,
                            limit: int = 100, order_by: ParticipantOrderByFields = "id", direction: Literal["asc", "desc"] = "asc",
                            db: Session = Depends(get_db)):
    participants = methods.read_participants_with_filters(db, study_id, participant_state, paused, proceed, offset, limit, order_by, direction)
    if not participants:
        raise HTTPException(status_code=409, detail="Study has no participants")
    
    return participants


@router.get("/studies/{study_id}/participants/count", response_model=int,
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_participants_count(study_id: int, participant_state: Union[ParticipantEnum, None] = None,
                            paused: Union[bool, None] = None, proceed: Union[bool, None] = None, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    participant_count = methods.count_participants_with_filters(db, study_id, participant_state, paused, proceed)
    return participant_count


@router.get("/studies/{study_id}/conditions", response_model=List[schema.populated.ConditionPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_conditions(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    conditions = methods.read_list_by(db, model.Condition, "study_id", study_id)
    if not conditions:
        raise HTTPException(status_code=409, detail="Study has no conditions")

    return conditions


@router.get("/studies/{study_id}/tasks", response_model=List[schema.populated.TaskPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_tasks(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    tasks = methods.read_list_by(db, model.Task, "study_id", study_id)
    if not tasks:
        raise HTTPException(status_code=409, detail="Study has no tasks")

    return tasks


@router.get("/studies/{study_id}/texts", response_model=List[schema.populated.TextPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_texts(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    texts = methods.read_list_by(db, model.Text, "study_id", study_id)
    if not texts:
        raise HTTPException(status_code=409, detail="Study has no texts")

    return texts


@router.get("/studies/{study_id}/questionnaires", response_model=List[schema.populated.QuestionnairePopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_questionnaires(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    questionnaires = methods.read_list_by(db, model.Questionnaire, "study_id", study_id)
    if not questionnaires:
        raise HTTPException(status_code=409, detail="Study has no questionnaires")

    return questionnaires


@router.get("/studies/{study_id}/pauses", response_model=List[schema.populated.PausePopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_pauses(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    pauses = methods.read_list_by(db, model.Pause, "study_id", study_id)
    if not pauses:
        raise HTTPException(status_code=409, detail="Study has no pauses")

    return pauses

# DEPRECATED! Only here for legacy documentation
@router.get("/studies/{study_id}/survey-participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)],
            deprecated=True)
async def populate_survey_participants(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    surveys = methods.read_list_by(db, model.Questionnaire, "study_id", study_id)
    if not surveys:
        raise HTTPException(status_code=409, detail="Study has no surveys")

    participants = methods.read_list_by(db, model.Participant, "study_id", study_id)
    if not participants:
        raise HTTPException(status_code=409, detail="Study has no participants")

    survey_participants = [{"token": str(p.token)} for p in participants]

    print(survey_participants)

    for survey in surveys:
        if survey.system == QuestionnaireSystemEnum.limesurvey and not survey.participants_populated:
            api_url = survey.api_url
            print(api_url)
            # LimeSurvey RPC class throws http errors
            limesurvey = methods.LimeSurvey(api_url, survey.api_username)
            limesurvey.get_session_key(survey.api_password)
            limesurvey.add_participants(survey.ext_id, survey_participants)
            limesurvey.release_session_key()

            survey.participants_populated = True
            db.commit()

    return


@router.get("/studies/{study_id}/participate", response_model=schema.api.Tokens)
async def participate(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    if not study.state == "running":
        raise HTTPException(status_code=403, detail="Study is inactive")
    if datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study has ended")
    participant = methods.draw_participant(db, study_id)
    if not participant:
        raise HTTPException(status_code=409, detail="No free Participants found")

    # public studies will generate another batch of tokens (planned_number_participants) if only 20% of planned number of participant are free
    if not study.invite_only:
        free_participant_count = methods.count_by_dict(db, model.Participant, {"study_id": study_id, "state": "free"})
        if (free_participant_count / study.planned_number_participants) <= 0.2:
            methods.add_participants(db, study_id, study.planned_number_participants)

    return methods.api.issue_tokens(str(participant.token), study.endDate, auth_method=methods.AuthMethod.PARTICIPANT_KEY)


@router.get("/studies/{study_id}/participate/{participant_token}", response_model=schema.api.Tokens)
async def participate(study_id: int, participant_token: UUID, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    if not study.state == "running" and datetime.datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study is too old, or inactive")

    participant = methods.read_participant_by_token(study_id, participant_token, db)
    if not participant:
        raise HTTPException(status_code=409, detail="No Participant found")
    if ParticipantEnum(participant.state) is ParticipantEnum.finished:
        raise HTTPException(status_code=403, detail="Already participated")
    if ParticipantEnum(participant.state) is ParticipantEnum.free:
        participant.state = ParticipantEnum.in_progress
        db.commit()

    return methods.api.issue_tokens(str(participant.token), study.endDate, auth_method=methods.AuthMethod.PARTICIPANT_KEY)


@router.get("/studies/{study_id}/export", response_model=schema.populated.StudyExport, response_model_exclude_none=True, dependencies=[Depends(methods.userAccessTokenValidator)])
async def export_study(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    main_procedure_config = study.procedure_config[0]
    return {"study": study, "procedure_config": main_procedure_config}


@router.post("/studies/import", response_model=schema.study.StudyDetails, dependencies=[Depends(methods.userAccessTokenValidator)])
async def import_study(study_import: schema.study.StudyImport, user: schema.user.User = Depends(UserValidator(strict_auth_method=True)), db: Session = Depends(get_db)):
    imported_study = methods.import_study(db, study_import, user.id)
    return imported_study


@router.get("/studies/{study_id}/duplicate", response_model=schema.study.StudyDetails, dependencies=[Depends(methods.userAccessTokenValidator)])
async def duplicate_study(study_id: int = StudyIdCheck, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    main_procedure_config = schema.procedure_config.ProcedureConfigImport.model_validate(study.procedure_config[0])
    study = schema.study.StudyDuplicateDetails.model_validate(study)
    duplicated_study = methods.duplicate_study(db, {"study": study, "procedure_config": main_procedure_config})
    return duplicated_study