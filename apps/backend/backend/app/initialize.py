"""Idempotent database bootstrap, run on container start (see prestart.sh).

Creates any missing tables and seeds the roles + initial admin user only when
the database is still empty. Safe to run on every boot, unlike init_db.py.
"""
from decouple import config
from passlib.context import CryptContext

import methods
from api import get_db
from model.base import Base, engine

# Import every model so all tables are registered on Base.metadata.
from model.collaborators import Collaborator
from model.condition import Condition
from model.group import Group
from model.group_invite import GroupInvite
from model.group_member import GroupMember
from model.pause import Pause
from model.procedure import Procedure
from model.participant import Participant
from model.procedure_progress import ProcedureProgress
from model.procedure_step import ProcedureStep
from model.procedure_config import ProcedureConfig
from model.procedure_config_step import ProcedureConfigStep
from model.questionnaire import Questionnaire
from model.role import Role
from model.study import Study
from model.task import Task
from model.text import Text
from model.user import User
from model.interaction import GenericInteraction, KeyboardInteraction, MouseInteraction, \
    DragInteraction, TouchInteraction, Touch
from model.machine_learning import MLModel, Prediction
from schema.role import RoleCreate
from schema.user import UserCreate


def main():
    # 1. Create any missing tables (idempotent — leaves existing tables alone).
    Base.metadata.create_all(engine)

    db = next(get_db())

    # 2. Seed roles + initial admin only when the database is fresh.
    if db.query(Role).count() == 0:
        admin_role = methods.create(db, Role, RoleCreate(name="admin"))
        methods.create(db, Role, RoleCreate(name="researcher"))

        pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        methods.create(db, User, UserCreate(
            name="admin",
            password=pwd_context.hash(config('INITIAL_ADMIN_PW')),
            firstname="Example",
            lastname="Administrator",
            email=config('INITIAL_ADMIN_EMAIL'),
            role_id=admin_role.id,
            is_active=True,
        ))
        print("initialize: created tables, roles and the initial admin user.")
    else:
        print("initialize: tables ensured; roles already present, skipping seed.")


if __name__ == "__main__":
    main()
