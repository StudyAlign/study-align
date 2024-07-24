"""introduce study state

Revision ID: f14e70520145
Revises: f215ab2b4d9d
Create Date: 2024-07-23 06:38:40.947109

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
from sqlalchemy import update
from sqlalchemy.dialects import postgresql

from model import Study


# revision identifiers, used by Alembic.
revision = 'f14e70520145'
down_revision = 'f215ab2b4d9d'
branch_labels = None
depends_on = None


study_state_enum = postgresql.ENUM("setup", "running", "finished", name='study_state_enum')

studies = sa.sql.table('studies', sa.Column('is_active'), sa.Column('state', study_state_enum))

def upgrade():
    study_state_enum.create(op.get_bind())

    study_state = sa.Column('state', sa.Enum("setup", "running", "finished", name="study_state_enum", create_type=False), nullable=True)
    op.add_column('studies', study_state)

    stmt = (
        studies.update().where(studies.c.is_active==True).values(state="running")
    )
    op.execute(stmt)

    stmt = (
        studies.update().where(studies.c.is_active==False).values(state="finished")
    )
    op.execute(stmt)

    op.drop_column('studies', 'is_active')

    op.alter_column('studies', 'state', nullable=False)
    pass


def downgrade():
    is_active = sa.Column('is_active', sa.Boolean, nullable=True)
    op.add_column('studies', is_active)

    stmt = (
        studies.update().where(studies.c.state == "running").values(is_active=True)
    )
    op.execute(stmt)

    stmt = (
        studies.update().where(studies.c.state == "finished" and studies.c.state  == "setup").values(is_active=False)
    )
    op.execute(stmt)

    stmt = (
        studies.update().where(studies.c.state  == None).values(is_active=False)
    )
    op.execute(stmt)

    op.drop_column('studies', 'state')
    study_state_enum.drop(op.get_bind())

    op.alter_column('studies', 'is_active', nullable=False)
    pass
