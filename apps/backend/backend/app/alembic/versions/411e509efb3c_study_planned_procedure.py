"""study planned procedure

Revision ID: 411e509efb3c
Revises: ad7ae8d95a25
Create Date: 2022-09-28 13:23:25.640084

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
from sqlalchemy.dialects.postgresql import JSONB

revision = '411e509efb3c'
down_revision = 'ad7ae8d95a25'
branch_labels = None
depends_on = None


def upgrade():
    planned_procedure = sa.Column('planned_procedure', JSONB, nullable=True)
    op.add_column('studies', planned_procedure)
    pass


def downgrade():
    op.drop_column('studies', 'planned_procedure')
    pass
