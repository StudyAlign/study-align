"""add pushed step state to procedure progress

Revision ID: 5598ccc51b69
Revises: 537db5b8936e
Create Date: 2025-03-17 08:53:27.177396

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '5598ccc51b69'
down_revision = '537db5b8936e'
branch_labels = None
depends_on = None


old_options = ("start_step", "end_step", "start_experiment", "end_experiment")
new_options = sorted(old_options + ('pushed_step',))

old_type = sa.Enum(*old_options, name='procedure_progress_enum')
new_type = sa.Enum(*new_options, name='procedure_progress_enum', create_type=False)
tmp_type = sa.Enum(*new_options, name='procedure_progress_enum_tmp', create_type=False)

procedure_progress = sa.sql.table('procedure_progress',
                   sa.Column('state', new_type))

def upgrade():
    # Create a temporary "procedure_progress_enum_tmp" type, convert and drop the "old" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE procedure_progress ALTER COLUMN state TYPE procedure_progress_enum_tmp'
               ' USING state::text::procedure_progress_enum_tmp')
    old_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "new" procedure_progress_enum type
    new_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE procedure_progress ALTER COLUMN state TYPE procedure_progress_enum'
               ' USING state::text::procedure_progress_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)


def downgrade():
    # Convert 'pushed_step' state into 'end_step'; this would still reveal a participant that has been pushed while
    # leaving the DB valid, i.e. an end_step duplicate indicates a pushed_step if a downgrade was mandatory
    op.execute(procedure_progress.update().where(procedure_progress.c.state==u'pushed_step')
               .values(state='end_step'))
    # Create a temporary "procedure_progress_enum_tmp" type, convert and drop the "new" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE procedure_progress ALTER COLUMN state TYPE procedure_progress_enum_tmp'
               ' USING state::text::procedure_progress_enum_tmp')
    new_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "old" procedure_progress_enum type
    old_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE procedure_progress ALTER COLUMN state TYPE procedure_progress_enum'
               ' USING state::text::procedure_progress_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)