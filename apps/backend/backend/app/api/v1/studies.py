import json
from datetime import datetime
from uuid import UUID

from fastapi import Depends, APIRouter, status, HTTPException
from typing import List, Union
from model.base import Session
from api import get_db, if_exists, if_not_zero

import model

import methods

from methods import AuthMethod, UserRole

import schema.study
import schema.procedure
import schema.api
from schema.participant import ParticipantEnum
from schema.questionnaire import QuestionnaireSystemEnum

router = APIRouter()

ENTITY = "Study"

@router.get("/studies", response_model=List[schema.study.StudyDetails], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_studies(db: Session = Depends(get_db)):
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


@router.patch("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def update_study(study_id: int, study: schema.study.StudyUpdate, db: Session = Depends(get_db)):
    study_update = methods.patch(db, model.Study, study, study_id)
    if_not_zero(study_update, ENTITY)
    return study_update


@router.delete("/studies/{study_id}", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def delete_study(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    db.delete(study)
    db.commit()
    return


@router.get("/studies/{study_id}/setup-info", response_model=schema.study.StudySetupInfo, dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_study_setup_info(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    return study


@router.post("/studies/{study_id}/procedures", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def generate_procedures_with_steps(study_id: int, db: Session = Depends(get_db)):
    procedures = methods.read_list_by(db, model.Procedure, "study_id", study_id)
    if procedures:
        raise HTTPException(status_code=409, detail="Procedures have already been generated")
    return methods.create_procedures_with_steps(db, study_id)


@router.post("/studies/{study_id}/participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def generate_participants(study_id: int, amount: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)
    participant_count = methods.count_by(db, model.Participant, "study_id", study_id)
    if participant_count != 0:
        raise HTTPException(status_code=409, detail="Participants have already been generated")
    return methods.create_participants(db, study_id, amount)


@router.get("/studies/{study_id}/participants", response_model=List[schema.populated.ParticipantPopulated], dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_participants(study_id: int, participant_state: Union[ParticipantEnum, None] = None,
                            paused: Union[bool, None] = None, proceed: Union[bool, None] = None, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    participants = methods.read_participants_with_filters(db, study_id, participant_state, paused, proceed)
    if not participants:
        raise HTTPException(status_code=409, detail="Study has no participants")
    
    return participants


@router.get("/studies/{study_id}/conditions", response_model=List[schema.populated.ConditionPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_conditions(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    conditions = methods.read_list_by(db, model.Condition, "study_id", study_id)
    if not conditions:
        raise HTTPException(status_code=409, detail="Study has no conditions")

    return conditions


@router.get("/studies/{study_id}/tasks", response_model=List[schema.populated.TaskPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_tasks(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    tasks = methods.read_list_by(db, model.Task, "study_id", study_id)
    if not tasks:
        raise HTTPException(status_code=409, detail="Study has no tasks")

    return tasks


@router.get("/studies/{study_id}/texts", response_model=List[schema.populated.TextPopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_texts(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    texts = methods.read_list_by(db, model.Text, "study_id", study_id)
    if not texts:
        raise HTTPException(status_code=409, detail="Study has no texts")

    return texts


@router.get("/studies/{study_id}/questionnaires", response_model=List[schema.populated.QuestionnairePopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_questionnaires(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    questionnaires = methods.read_list_by(db, model.Questionnaire, "study_id", study_id)
    if not questionnaires:
        raise HTTPException(status_code=409, detail="Study has no questionnaires")

    return questionnaires


@router.get("/studies/{study_id}/pauses", response_model=List[schema.populated.PausePopulated],
            dependencies=[Depends(methods.userAccessTokenValidator)])
async def read_pauses(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

    pauses = methods.read_list_by(db, model.Pause, "study_id", study_id)
    if not pauses:
        raise HTTPException(status_code=409, detail="Study has no pauses")

    return pauses


@router.get("/studies/{study_id}/survey-participants", status_code=status.HTTP_204_NO_CONTENT, dependencies=[Depends(methods.userAccessTokenValidator)])
async def populate_survey_participants(study_id: int, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, ENTITY)

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
    if not study.is_active:
        raise HTTPException(status_code=403, detail="Study is inactive")
    if datetime.utcnow() >= study.endDate:
        raise HTTPException(status_code=403, detail="Study has ended")
    participant = methods.draw_participant(db, study_id)
    if not participant:
        raise HTTPException(status_code=409, detail="No Participants found")
    return methods.api.issue_tokens(str(participant.token), study.endDate, auth_method=methods.AuthMethod.PARTICIPANT_KEY)


@router.get("/studies/{study_id}/participate/{participant_token}", response_model=schema.api.Tokens)
async def participate(study_id: int, participant_token: UUID, db: Session = Depends(get_db)):
    study = methods.read(db, model.Study, study_id)
    if_exists(study, "Study")
    if not study.is_active and datetime.datetime.utcnow() >= study.endDate:
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