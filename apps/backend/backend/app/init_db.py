from decouple import config
from passlib.context import CryptContext

import methods
from api import get_db
from model.base import Base, engine
from model.collaborators import Collaborator
from model.condition import Condition
from model.pause import Pause
from model.procedure import Procedure
from model.participant import Participant
from model.procedure_progress import ProcedureProgress
from model.procedure_step import ProcedureStep
from model.procedure_config import ProcedureConfig
from model.procedure_config_step import ProcedureConfigStep
from model.questionnaire import Questionnaire
from model.questionnaire_result import QuestionnaireResult
from model.role import Role
from model.study import Study
from model.task import Task
from model.text import Text
from model.user import User

from model.interaction import GenericInteraction, KeyboardInteraction, MouseInteraction, DragInteraction, \
    TouchInteraction, Touch
from model.machine_learning import MLModel, Prediction
from schema.role import RoleCreate
from schema.user import UserCreate

Condition.__table__
Procedure.__table__
Participant.__table__
Pause.__table__
ProcedureStep.__table__
ProcedureProgress.__table__
ProcedureConfig.__table__
ProcedureConfigStep.__table__
Questionnaire.__table__
QuestionnaireResult.__table__
Role.__table__
Study.__table__
Task.__table__
Text.__table__
User.__table__
Collaborator.__table__

GenericInteraction.__table__
KeyboardInteraction.__table__
MouseInteraction.__table__
DragInteraction.__table__
TouchInteraction.__table__
Touch.__table__

MLModel.__table__
Prediction.__table__

Base.metadata.create_all(engine)

# init data
db = next(get_db())
print(db)
admin_role = methods.create(db, Role, RoleCreate(name="admin"))
researcher_role = methods.create(db, Role, RoleCreate(name="researcher"))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
password=config('INITIAL_ADMIN_PW')
pwd_hash = pwd_context.hash(password)
admin_user = methods.create(db, User, UserCreate(name="admin", password=pwd_hash,
                                                 firstname="Example", lastname="Administrator",
                                                 email="norply@studyalign.com",
                                                 role_id=admin_role.id, is_active=True))
