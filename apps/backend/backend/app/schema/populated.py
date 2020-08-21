from typing import Optional, List

from schema.machine_learning import MLModel, Prediction
from schema.procedure_progress import ProcedureProgress
from schema.procedure_step import ProcedureStep
from schema.condition import Condition
from schema.procedure import Procedure
from schema.participant import Participant
from schema.questionnaire import Questionnaire
from schema.study import Study
from schema.task import Task
from schema.text import Text


class ConditionPopulated(Condition):
    study: Study

    class Config:
        orm_mode = True


class ProcedureStepPopulated(ProcedureStep):
    condition: Optional[Condition] = None
    text: Optional[Text] = None
    questionnaire: Optional[Questionnaire] = None

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
    pass


class MLModelDistributePopulated(MLModelPopulated):
    path: str


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
