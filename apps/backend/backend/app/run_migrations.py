"""Apply Alembic migrations on deploy (run by prestart.sh, after initialize.py).

This project builds its schema with ``Base.metadata.create_all`` (see
initialize.py), so a fresh database already matches the latest models, including
tables that also exist as Alembic migrations. The historical migration chain can
therefore not run from base: its ``create_table`` steps would collide with the
tables ``create_all`` just made. This runner reconciles the two:

  * A database with no Alembic version row (a fresh ``create_all`` install, or a
    legacy deployment that predates Alembic being wired into the boot) is
    baselined at the head's parent revision. Its structure already matches every
    migration up to there; the head migration is written idempotently, so the
    following upgrade is a no-op on a fresh database and only fills real gaps on a
    database whose tables ``create_all`` could not alter (added columns, new enum
    values, ...).
  * A database already under Alembic control is simply upgraded to head.

Consequence for new migrations: the *head* migration must be idempotent (guard
with ``sa.inspect``), because on a fresh database the baseline-at-parent path
runs it against a schema that already contains its changes. Once a newer
migration is added on top, the previous head is only ever reached via a normal
in-order upgrade, so only the current head carries this requirement. See
``08326335472b`` for the pattern.
"""
import os

from alembic import command
from alembic.config import Config
from alembic.runtime.migration import MigrationContext
from alembic.script import ScriptDirectory

from model.base import engine

HERE = os.path.dirname(os.path.abspath(__file__))


def _make_config():
    cfg = Config(os.path.join(HERE, "alembic.ini"))
    # Resolve the script location independently of the working directory.
    cfg.set_main_option("script_location", os.path.join(HERE, "alembic"))
    return cfg


def main():
    cfg = _make_config()
    script = ScriptDirectory.from_config(cfg)

    head = script.get_current_head()
    if head is None:
        print("migrations: no revisions found, nothing to do.")
        return

    with engine.connect() as connection:
        current = MigrationContext.configure(connection).get_current_revision()

    if current is None:
        parent = script.get_revision(head).down_revision
        # A merge point exposes several parents; any of them is a valid baseline,
        # the upgrade reconciles the rest.
        if isinstance(parent, (tuple, list)):
            parent = parent[0] if parent else None
        if parent is not None:
            print("migrations: no version present, baselining at %s ..." % parent)
            command.stamp(cfg, parent)
        else:
            print("migrations: no version present and head is base, upgrading from base ...")

    print("migrations: upgrading to head ...")
    command.upgrade(cfg, "head")
    print("migrations: done.")


if __name__ == "__main__":
    main()
