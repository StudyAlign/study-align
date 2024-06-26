"""add information value to study setup step enum

Revision ID: ddd65236151a
Revises: 557c51b7b17b
Create Date: 2024-06-25 15:34:32.270016

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ddd65236151a'
down_revision = '557c51b7b17b'
branch_labels = None
depends_on = None

old_options = ("study", "procedure", "integrations", "check", "done")
new_options = sorted(old_options + ('information',))

old_type = sa.Enum(*old_options, name='current_setup_step_enum')
new_type = sa.Enum(*new_options, name='current_setup_step_enum', create_type=False)
tmp_type = sa.Enum(*new_options, name='current_setup_step_enum_tmp', create_type=False)

studies = sa.sql.table('studies',
                   sa.Column('current_setup_step', new_type))

def upgrade():
    # Create a temporary "current_setup_step_enum_tmp" type, convert and drop the "old" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE studies ALTER COLUMN current_setup_step TYPE current_setup_step_enum_tmp'
               ' USING current_setup_step::text::current_setup_step_enum_tmp')
    old_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "new" current_setup_step_enum type
    new_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE studies ALTER COLUMN current_setup_step TYPE current_setup_step_enum'
               ' USING current_setup_step::text::current_setup_step_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)


def downgrade():
    # Convert 'information' current_setup_step into 'done'
    op.execute(studies.update().where(studies.c.current_setup_step==u'information')
               .values(current_setup_step='done'))
    # Create a temporary "current_setup_step_enum_tmp" type, convert and drop the "new" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE studies ALTER COLUMN current_setup_step TYPE current_setup_step_enum_tmp'
               ' USING current_setup_step::text::current_setup_step_enum_tmp')
    new_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "old" current_setup_step_enum type
    old_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE studies ALTER COLUMN current_setup_step TYPE current_setup_step_enum'
               ' USING current_setup_step::text::current_setup_step_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)