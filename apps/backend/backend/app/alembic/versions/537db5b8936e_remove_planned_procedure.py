"""remove planned procedure

Revision ID: 537db5b8936e
Revises: f14e70520145
Create Date: 2024-07-24 08:03:02.193055

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '537db5b8936e'
down_revision = 'f14e70520145'
branch_labels = None
depends_on = None


def upgrade():
    op.drop_column('studies', 'planned_procedure')
    pass


def downgrade():
    is_active = sa.Column('planned_procedure', JSONB, nullable=True)
    op.add_column('studies', is_active)
    pass
