"""add procedure configs

Revision ID: bdf40613425e
Revises: 411e509efb3c
Create Date: 2023-11-13 16:58:17.735673

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import false

# revision identifiers, used by Alembic.
revision = 'bdf40613425e'
down_revision = '411e509efb3c'
branch_labels = None
depends_on = None

procedure_config_steps = [
    ("procedure_config_steps_procedure_config_id_fkey", "procedure_configs", "procedure_config_id"),
    ("procedure_config_steps_condition_id_fkey", "conditions", "condition_id"),
    ("procedure_config_steps_text_id_fkey", "texts", "text_id"),
    ("procedure_config_steps_questionnaire_id_fkey", "questionnaires", "questionnaire_id"),
    ("procedure_config_steps_pause_id_fkey", "pauses", "pause_id"),
    ("procedure_config_steps_block_id_fkey", "procedure_configs", "block_id")
]


def upgrade():
    op.create_table(
        'procedure_configs',
        sa.Column('id', sa.Integer()),
        sa.Column('study_id', sa.Integer()),
        sa.Column('main', sa.Boolean(), server_default=false(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_foreign_key(
        constraint_name="procedure_configs_study_id_fkey",
        source_table="procedure_configs",
        referent_table="studies",
        local_cols=["study_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_table(
        'procedure_config_steps',
        sa.Column('id', sa.Integer()),
        sa.Column('procedure_config_id', sa.Integer()),
        sa.Column('condition_id', sa.Integer()),
        sa.Column('text_id', sa.Integer()),
        sa.Column('questionnaire_id', sa.Integer()),
        sa.Column('pause_id', sa.Integer()),
        sa.Column('block_id', sa.Integer()),
        sa.Column('order', sa.Integer()),
        sa.Column('counterbalance', sa.Boolean(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )

    for (constraint, referent_table, local_col) in procedure_config_steps:
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="procedure_config_steps",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"],
            ondelete="CASCADE")

    op.create_unique_constraint("_unique_config_step_ix", "procedure_config_steps", ["condition_id", "text_id", "questionnaire_id", "pause_id", "block_id"])

    pass


def downgrade():
    op.drop_table("procedure_config_steps")
    op.drop_table("procedure_configs")
    pass
