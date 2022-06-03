import uuid
from typing import Optional, List

from schema.machine_learning import MLModel, Prediction
from schema.procedure_progress import ProcedureProgress
from schema.procedure_step import ProcedureStep
from schema.condition import Condition, ConditionStep
from schema.procedure import Procedure
from schema.participant import Participant
from schema.questionnaire import Questionnaire, QuestionnaireStep
from schema.study import Study
from schema.task import Task
from schema.text import Text, TextStep
from schema.user import User
from schema.role import Role


class ConditionPopulated(Condition):
    study: Study

    class Config:
        orm_mode = True


class ProcedureStepPopulated(ProcedureStep):
    condition: Optional[ConditionStep] = None
    text: Optional[TextStep] = None
    questionnaire: Optional[QuestionnaireStep] = None

    class Config:
        orm_mode = True


class ProcedurePopulated(Procedure):
    study: Study
    procedure_steps: List[ProcedureStepPopulated]

    class Config:
        orm_mode = True


class ProcedureProgressPopulated(ProcedureProgress):
    procedure_step: ProcedureStep

    class Config:
        orm_mode = True


class ParticipantPopulated(Participant):
    procedure: Optional[ProcedurePopulated] = None
    procedure_step: Optional[ProcedureStepPopulated] = None
    study: Study

    class Config:
        orm_mode = True


class QuestionnairePopulated(Questionnaire):
    id: int

    class Config:
        orm_mode = True


class PredictionPopulated(Prediction):
    ml_model: MLModel
    participant: Participant
    condition: Condition

    class Config:
        orm_mode = True


class MLModelPopulated(MLModel):
    condition: Condition

    class Config:
        orm_mode = True


class MLModelCloudPopulated(MLModelPopulated):
    path: str
    key: uuid.UUID


class MLModelDistributePopulated(MLModelPopulated):
    pass


class TaskPopulated(Task):
    condition: Optional[Condition]

    class Config:
        orm_mode = True


class TextPopulated(Text):
    study: Optional[Study]

    class Config:
        orm_mode = True


class QuestionnairePopulated(Questionnaire):
    study: Optional[Study]

    class Config:
        orm_mode = True


class UserPopulated(User):
    role: Optional[Role]

    class Config:
        orm_mode = True