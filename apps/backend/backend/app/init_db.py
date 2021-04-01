from model.base import Base, engine
from model.condition import Condition
from model.procedure import Procedure
from model.participant import Participant
from model.procedure_progress import ProcedureProgress
from model.procedure_step import ProcedureStep
from model.questionnaire import Questionnaire
from model.questionnaire_result import QuestionnaireResult
from model.study import Study
from model.task import Task
from model.text import Text

from model.interaction import GenericInteraction, KeyboardInteraction, MouseInteraction, DragInteraction, \
    TouchInteraction, Touch
from model.machine_learning import MLModel, Prediction

Condition.__table__
Procedure.__table__
Participant.__table__
ProcedureStep.__table__
ProcedureProgress.__table__
Questionnaire.__table__
QuestionnaireResult.__table__
Study.__table__
Task.__table__
Text.__table__

GenericInteraction.__table__
KeyboardInteraction.__table__
MouseInteraction.__table__
DragInteraction.__table__
TouchInteraction.__table__
Touch.__table__

MLModel.__table__
Prediction.__table__

Base.metadata.create_all(engine)
