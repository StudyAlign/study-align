import uuid

from fastapi import Path, Query, Depends, HTTPException
from starlette import status

import methods
import model
from api import get_db, if_exists
from methods import user_validator, UserRole
from model import Session, Study, Group
from model.base import Base
from schema.user import User


def is_allowed(study, user, entity = "Study"):
    if user.role.name == UserRole.RESEARCHER:
        is_collaborator = False
        for collaborator in study.collaborators:
            is_collaborator = collaborator.user_id == user.id
            if is_collaborator: break

        is_group_member = False
        if study.group:
            for group_member in study.group.group_members:
                is_group_member = group_member.user_id == user.id
                if is_group_member: break

        if study.owner_id != user.id and not (is_collaborator or is_group_member):
            message = "Can only edit own studies or collaborative studies" if entity == "Study" else "Can only edit " + entity + " of own or collaborative studies"
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=message
            )


def basic_check(id: int, entity: str, user: User, model: Base, db: Session):
    data = methods.read(db, model, id)
    if_exists(data, entity)

    study = data if isinstance(data, Study) else data.study
    is_allowed(study, user, entity)


class UserIdRoleCheck:
    async def __call__(self, user_id: int = Path(), user = Depends(user_validator)):
        if user.role.name == UserRole.RESEARCHER:
            if user_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Can only edit own user profile"
                )
        return user_id


class CollaboratorIdRoleCheck:
    async def __call__(self, collaborator_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(collaborator_id, "Collaborator", user, model.Collaborator, db)
        return collaborator_id


class ConditionIdRoleCheck:
    async def __call__(self, condition_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(condition_id, "Condition", user, model.Condition, db)
        return condition_id


class QuestionnaireIdRoleCheck:
    async def __call__(self, questionnaire_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(questionnaire_id, "Questionnaire", user, model.Questionnaire, db)
        return questionnaire_id


class TextIdRoleCheck:
    async def __call__(self, text_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(text_id, "Text", user, model.Text, db)
        return text_id


class PauseIdRoleCheck:
    async def __call__(self, pause_id: int = Path(), user=Depends(user_validator),
                       db: Session = Depends(get_db)):
        basic_check(pause_id, "Pause", user, model.Pause, db)
        return pause_id


class ProcedureConfigIdRoleCheck:
    async def __call__(self, procedure_config_id: int = Path(), user=Depends(user_validator),
                       db: Session = Depends(get_db)):
        basic_check(procedure_config_id, "ProcedureConfig", user, model.ProcedureConfig, db)
        return procedure_config_id


class ParticipantIdRoleCheck:
    async def __call__(self, participant_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(participant_id, "Participant", user, model.Participant, db)
        return participant_id


class ParticipantTokenRoleCheck:
    async def __call__(self, participant_token: uuid.UUID = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        participant = methods.read_by(db, model.Participant, "token", participant_token)
        if_exists(participant, "Participant")

        if user.role.name == UserRole.RESEARCHER:
            if participant.study.owner_id != user.id:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Can only edit Participant of own study"
                )
        return participant_token


class ProcedureIdRoleCheck:
    async def __call__(self, procedure_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(procedure_id, "Procedure", user, model.Procedure, db)
        return procedure_id


class StudyIdRoleCheck:
    async def __call__(self, study_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        basic_check(study_id, "Study", user, model.Study, db)
        return study_id


class GroupIdRoleCheck:
    async def __call__(self, group_id: int = Path(), user = Depends(user_validator), db: Session = Depends(get_db)):
        data = methods.read(db, model.Group, group_id)
        if_exists(data, "Group")

        group = data if isinstance(data, Group) else data.group
        if user.role.name == UserRole.RESEARCHER:
            if group.owner_id != user.id:
                message = "Can only edit own groups"
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=message
                )

        return group_id