"""study planned participants setup step

Revision ID: a98b40583e73
Revises: 6e99fcd0daf9
Create Date: 2022-07-12 17:26:14.646885

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
from sqlalchemy import update
from sqlalchemy.dialects import postgresql

from model import Study

revision = 'a98b40583e73'
down_revision = '6e99fcd0daf9'
branch_labels = None
depends_on = None


current_setup_step_enum = postgresql.ENUM("study", "procedure", "integrations", "check", "done", name='current_setup_step_enum')

def upgrade():
    planned_number_participants = sa.Column('planned_number_participants', sa.Integer)
    op.add_column('studies', planned_number_participants)

    current_setup_step_enum.create(op.get_bind())

    current_setup_step = sa.Column('current_setup_step', sa.Enum("study", "procedure", "integrations", "check", "done", name="current_setup_step_enum", create_type=False))
    op.add_column('studies', current_setup_step)

    stmt = (
        update(Study).values(planned_number_participants=50, current_setup_step="study")
    )

    op.execute(stmt)

    pass


def downgrade():
    op.drop_column('studies', 'planned_number_participants')
    op.drop_column('studies', 'current_setup_step')

    current_setup_step_enum.drop(op.get_bind())
    pass
