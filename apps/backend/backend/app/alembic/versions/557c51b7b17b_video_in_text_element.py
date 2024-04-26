"""video in text element

Revision ID: 557c51b7b17b
Revises: bdf40613425e
Create Date: 2024-04-25 14:08:05.254596

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, String

# revision identifiers, used by Alembic.
revision = '557c51b7b17b'
down_revision = 'bdf40613425e'
branch_labels = None
depends_on = None

def upgrade():
    planned_procedure = sa.Column('video', String())
    op.add_column('texts', planned_procedure)
    pass


def downgrade():
    op.drop_column('texts', 'video')
    pass
