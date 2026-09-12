"""iterate questionnaires to support more survey tools

Revision ID: f215ab2b4d9d
Revises: ddd65236151a
Create Date: 2024-06-28 08:53:07.942127

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, String, Boolean, update, column
from sqlalchemy.dialects.postgresql import JSONB

from model import Questionnaire

# revision identifiers, used by Alembic.
revision = 'f215ab2b4d9d'
down_revision = 'ddd65236151a'
branch_labels = None
depends_on = None


old_options = ("limesurvey", "soscisurvey", "surveymonkey")
new_options = ("qualtrics", "surveymonkey", "googleforms", "typeform", "jotform", "limesurvey")

old_type = sa.Enum(*old_options, name='system_enum')
new_type = sa.Enum(*new_options, name='system_enum', create_type=False, nullable=True)
tmp_type = sa.Enum(*new_options, name='system_enum_tmp', create_type=False)

studies = sa.sql.table('questionnaires',
                   sa.Column('system', new_type))


def upgrade():
    # Create a temporary "system_enum_tmp" type, convert and drop the "old" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE questionnaires ALTER COLUMN system TYPE system_enum_tmp'
               ' USING system::text::system_enum_tmp')
    old_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "new" system_enum type
    new_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE questionnaires ALTER COLUMN system TYPE system_enum'
               ' USING system::text::system_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)

    # drop columns
    op.drop_column('questionnaires', 'api_url')
    op.drop_column('questionnaires', '_api_credentials')
    op.drop_column('questionnaires', 'ext_id')
    op.drop_column('questionnaires', 'participants_populated')

    pass


def downgrade():
    # Convert new system_enums into 'null'
    op.execute(studies.update().filter(studies.c.system.in_(["qualtrics", "googleforms", "typeform", "jotform"]))
               .values(system=None))
    # Create a temporary "system_enum_tmp" type, convert and drop the "new" type
    tmp_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE questionnaires ALTER COLUMN system TYPE system_enum_tmp'
               ' USING system::text::system_enum_tmp')
    new_type.drop(op.get_bind(), checkfirst=False)
    # Create and convert to the "old" system_enum type
    old_type.create(op.get_bind(), checkfirst=False)
    op.execute('ALTER TABLE questionnaires ALTER COLUMN system TYPE system_enum'
               ' USING system::text::system_enum')
    tmp_type.drop(op.get_bind(), checkfirst=False)

    # recreate columns
    op.add_column('questionnaires', Column("api_url", String))
    op.add_column('questionnaires', Column("_api_credentials", JSONB))
    op.add_column('questionnaires', Column("ext_id", String))

    op.add_column('questionnaires', Column("participants_populated", Boolean, default=False))
    op.execute(sa.sql.table('questionnaires', column('participants_populated')).update().values(participants_populated=False))
    op.alter_column('questionnaires', 'participants_populated', nullable=False)

    pass
