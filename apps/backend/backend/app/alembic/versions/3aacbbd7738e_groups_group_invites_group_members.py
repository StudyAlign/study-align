"""groups, group invites, group members

Revision ID: 3aacbbd7738e
Revises: 5598ccc51b69
Create Date: 2026-02-20 20:28:35.801224

"""
import uuid

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID



# revision identifiers, used by Alembic.
revision = '3aacbbd7738e'
down_revision = '5598ccc51b69'
branch_labels = None
depends_on = None


def upgrade():

    # add groups table
    op.create_table(
        'groups',
        sa.Column('id', sa.Integer()),
        sa.Column('name', sa.String(60)),
        sa.Column('slug', sa.String(60)),
        sa.Column('owner_id', sa.Integer()),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_foreign_key(
        constraint_name="groups_owner_id_fkey",
        source_table="groups",
        referent_table="users",
        local_cols=["owner_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_unique_constraint("groups_name_key", "groups", ["name"])
    op.create_unique_constraint("groups_slug_key", "groups", ["slug"])

    # add group members table

    op.create_table(
        'group_members',
        sa.Column('id', sa.Integer()),
        sa.Column('group_id', sa.Integer()),
        sa.Column('user_id', sa.Integer()),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_foreign_key(
        constraint_name="group_members_group_id_fkey",
        source_table="group_members",
        referent_table="groups",
        local_cols=["group_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_foreign_key(
        constraint_name="groups_members_user_id_fkey",
        source_table="group_members",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_unique_constraint("_unique_group_members_ix", "group_members", ["group_id", "user_id"])

    # add group invites table

    op.create_table(
        'group_invites',
        sa.Column('id', sa.Integer()),
        sa.Column('token', UUID(as_uuid=True), nullable=False, default=uuid.uuid4()),
        sa.Column('group_id', sa.Integer()),
        sa.Column('user_id', sa.Integer()),
        sa.Column('invited_by_id', sa.Integer()),
        sa.PrimaryKeyConstraint('id')
    )

    op.create_foreign_key(
        constraint_name="group_invites_group_id_fkey",
        source_table="group_invites",
        referent_table="groups",
        local_cols=["group_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_foreign_key(
        constraint_name="group_invites_user_id_fkey",
        source_table="group_invites",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_foreign_key(
        constraint_name="group_invites_invited_by_id_fkey",
        source_table="group_invites",
        referent_table="users",
        local_cols=["invited_by_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.create_unique_constraint("group_invites_token_key", "group_invites", ["token"])

    # add group_id column to studies

    studies_group_id = sa.Column('group_id', sa.Integer)
    op.add_column('studies', studies_group_id)

    op.create_foreign_key(
        constraint_name="studies_group_id_fkey",
        source_table="studies",
        referent_table="groups",
        local_cols=["group_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    pass


def downgrade():
    op.drop_constraint(constraint_name="studies_group_id_fkey", table_name="studies",
                       type_="foreignkey")
    op.drop_column('studies', 'group_id')

    op.drop_table("group_invites")
    op.drop_table("group_members")
    op.drop_table("groups")

    pass
