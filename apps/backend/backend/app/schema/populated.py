import uuid
from typing import Optional, List

from pydantic import BaseModel

from schema.machine_learning import MLModel, Prediction
from schema.procedure_config import ProcedureConfigStep, ProcedureConfig
from schema.procedure_progress import ProcedureProgress
from schema.procedure_step import ProcedureStep
from schema.condition import Condition, ConditionStep, ConditionBase
from schema.procedure import Procedure
from schema.participant import Participant
from schema.questionnaire import Questionnaire, QuestionnaireStep, QuestionnaireBase
from schema.study import Study, StudyExportDetails
from schema.task import Task
from schema.text import Text, TextStep, TextBase
from schema.user import User, UserView
from schema.role import Role
from schema.pause import Pause, PauseStep, PauseBase
from schema.collaborator import Collaborator
from schema.group_member import GroupMember
from schema.group_invite import GroupInvite


class ConditionPopulated(Condition):
    study: Study

    class Config:
        from_attributes = True


class ProcedureConfigStepPopulated(ProcedureConfigStep):
    condition: Optional[Condition] = None
    text: Optional[Text] = None
    questionnaire: Optional[Questionnaire] = None
    pause: Optional[Pause] = None
    block: Optional["ProcedureConfigBlockPopulated"] = None

    class Config:
        from_attributes = True


class ProcedureConfigPopulated(ProcedureConfig):
    procedure_config_steps: List["ProcedureConfigStepPopulated"]

    class Config:
        from_attributes = True

# Schemas for study export:

class ProcedureConfigStepExportPopulated(BaseModel):
    order: int
    counterbalance: bool

    condition: Optional[ConditionBase]
    text: Optional[TextBase]
    questionnaire: Optional[QuestionnaireBase]
    pause: Optional[PauseBase]
    block: Optional["ProcedureConfigExport"]

    class Config:
        from_attributes = True


class ProcedureConfigExport(BaseModel):
    procedure_config_steps: List["ProcedureConfigStepExportPopulated"]

    class Config:
        from_attributes = True


class StudyExport(BaseModel):
    study: StudyExportDetails
    procedure_config: ProcedureConfigExport

    class Config:
        from_attributes = True

# Schemas for Study Export end


class ProcedureConfigOverview(ProcedureConfig):
    study: Study
    procedure_config_steps: List["ProcedureConfigStepPopulated"]

    class Config:
        from_attributes = True


class ProcedureConfigBlockPopulated(ProcedureConfig):
    procedure_config_steps: List["ProcedureConfigStepPopulated"]

    class Config:
        from_attributes = True



class ProcedureStepPopulated(ProcedureStep):
    condition: Optional[ConditionStep] = None
    text: Optional[TextStep] = None
    questionnaire: Optional[QuestionnaireStep] = None
    pause: Optional[PauseStep] = None

    class Config:
        from_attributes = True


class ProcedurePopulated(Procedure):
    study: Study
    procedure_steps: List[ProcedureStepPopulated]

    class Config:
        from_attributes = True


class ProcedureProgressPopulated(ProcedureProgress):
    procedure_step: ProcedureStep

    class Config:
        from_attributes = True


class ParticipantPopulated(Participant):
    procedure: Optional[ProcedurePopulated] = None
    procedure_step: Optional[ProcedureStepPopulated] = None
    study: Study

    class Config:
        from_attributes = True


class QuestionnairePopulated(Questionnaire):
    id: int

    class Config:
        from_attributes = True


class PredictionPopulated(Prediction):
    ml_model: MLModel
    participant: Participant
    condition: Condition

    class Config:
        from_attributes = True


class MLModelPopulated(MLModel):
    condition: Condition

    class Config:
        from_attributes = True


class MLModelCloudPopulated(MLModelPopulated):
    path: str
    key: uuid.UUID


class MLModelDistributePopulated(MLModelPopulated):
    pass


class TaskPopulated(Task):
    condition: Optional[Condition] = None

    class Config:
        from_attributes = True


class TextPopulated(Text):
    study: Optional[Study] = None

    class Config:
        from_attributes = True


class QuestionnairePopulated(Questionnaire):
    study: Optional[Study] = None

    class Config:
        from_attributes = True


class PausePopulated(Pause):
    study: Optional[Study] = None

    class Config:
        from_attributes = True


class UserPopulated(User):
    role: Optional[Role] = None

    class Config:
        from_attributes = True


class CollaboratorPopulated(Collaborator):
    user: Optional[User] = None

    class Config:
        from_attributes = True


class GroupMemberPopulated(GroupMember):
    user: Optional[UserView] = None

    class Config:
        from_attributes = True


class GroupInvitePopulated(GroupInvite):
    user: Optional[UserView] = None
    invited_by: Optional[UserView] = None

    class Config:
        from_attributes = True