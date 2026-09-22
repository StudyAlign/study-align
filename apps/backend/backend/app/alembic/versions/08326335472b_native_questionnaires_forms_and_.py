"""native questionnaires: forms, form_responses, and questionnaire form links

Revision ID: 08326335472b
Revises: 3aacbbd7738e
Create Date: 2026-09-22 06:03:14.624183

This project initializes its schema with ``Base.metadata.create_all`` (see
initialize.py, run by prestart.sh), which creates new *tables* on boot but does
not alter existing ones. So this migration is written idempotently: it creates
the ``forms`` / ``form_responses`` tables only if they are missing, and adds the
``native`` enum value and the ``questionnaires`` form links only if absent. That
way it is safe on a database already touched by ``create_all`` and on a
migration-only database alike.
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import JSONB


# revision identifiers, used by Alembic.
revision = '08326335472b'
down_revision = '3aacbbd7738e'
branch_labels = None
depends_on = None


def upgrade():
    bind = op.get_bind()
    insp = sa.inspect(bind)

    # ── forms: native questionnaire definitions (templates + global + study copies)
    if not insp.has_table('forms'):
        op.create_table(
            'forms',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('name', sa.String(), nullable=False),
            sa.Column('description', sa.String(), nullable=True),
            sa.Column('definition', JSONB(), nullable=False),
            sa.Column('is_template', sa.Boolean(), nullable=False),
            sa.Column('is_global', sa.Boolean(), nullable=False),
            sa.Column('slug', sa.String(), nullable=True),
            sa.Column('version', sa.Integer(), nullable=False),
            sa.Column('owner_id', sa.Integer(), nullable=True),
            sa.Column('study_id', sa.Integer(), nullable=True),
            sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.ForeignKeyConstraint(['owner_id'], ['users.id'], name='forms_owner_id_fkey', ondelete='SET NULL'),
            sa.ForeignKeyConstraint(['study_id'], ['studies.id'], name='forms_study_id_fkey', ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('slug', name='forms_slug_key'),
        )

    # ── form_responses: one participant's answers to one native questionnaire
    if not insp.has_table('form_responses'):
        op.create_table(
            'form_responses',
            sa.Column('id', sa.Integer(), nullable=False),
            sa.Column('form_id', sa.Integer(), nullable=False),
            sa.Column('participant_id', sa.Integer(), nullable=False),
            sa.Column('study_id', sa.Integer(), nullable=True),
            sa.Column('form_version', sa.Integer(), nullable=True),
            sa.Column('answers', JSONB(), nullable=False),
            sa.Column('submitted', sa.Boolean(), nullable=False),
            sa.Column('created_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), nullable=True),
            sa.ForeignKeyConstraint(['form_id'], ['forms.id'], name='form_responses_form_id_fkey', ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['participant_id'], ['participants.id'], name='form_responses_participant_id_fkey', ondelete='CASCADE'),
            sa.ForeignKeyConstraint(['study_id'], ['studies.id'], name='form_responses_study_id_fkey', ondelete='CASCADE'),
            sa.PrimaryKeyConstraint('id'),
            sa.UniqueConstraint('form_id', 'participant_id', name='uq_form_participant'),
        )

    # ── new "native" value on the questionnaire system enum
    op.execute("ALTER TYPE system_enum ADD VALUE IF NOT EXISTS 'native'")

    # ── questionnaire -> form links (native step renders form_id, copied from source_form_id)
    questionnaire_cols = [c['name'] for c in insp.get_columns('questionnaires')]
    if 'form_id' not in questionnaire_cols:
        op.execute("ALTER TABLE questionnaires ADD COLUMN form_id INTEGER REFERENCES forms(id) ON DELETE SET NULL")
    if 'source_form_id' not in questionnaire_cols:
        op.execute("ALTER TABLE questionnaires ADD COLUMN source_form_id INTEGER REFERENCES forms(id) ON DELETE SET NULL")


def downgrade():
    bind = op.get_bind()
    insp = sa.inspect(bind)

    questionnaire_cols = [c['name'] for c in insp.get_columns('questionnaires')]
    if 'source_form_id' in questionnaire_cols:
        op.drop_column('questionnaires', 'source_form_id')
    if 'form_id' in questionnaire_cols:
        op.drop_column('questionnaires', 'form_id')

    if insp.has_table('form_responses'):
        op.drop_table('form_responses')
    if insp.has_table('forms'):
        op.drop_table('forms')

    # Note: PostgreSQL cannot drop a value from an enum type, so 'native' remains
    # on system_enum after a downgrade. This is harmless (it is simply unused).
