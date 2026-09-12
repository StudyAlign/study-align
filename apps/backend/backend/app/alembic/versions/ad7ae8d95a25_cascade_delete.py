"""cascade delete

Revision ID: ad7ae8d95a25
Revises: a98b40583e73
Create Date: 2022-09-21 10:49:27.249957

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ad7ae8d95a25'
down_revision = 'a98b40583e73'
branch_labels = None
depends_on = None

names = [
    ("conditions_study_id_fkey", "conditions"),
    ("procedures_study_id_fkey", "procedures"),
    ("participants_study_id_fkey", "participants"),
    ("collaborators_study_id_fkey", "collaborators"),
    ("pauses_study_id_fkey", "pauses"),
    ("questionnaires_study_id_fkey", "questionnaires"),
    ("texts_study_id_fkey", "texts"),
    ("drag_interactions_study_id_fkey", "drag_interactions"),
    ("generic_interactions_study_id_fkey", "generic_interactions"),
    ("keyboard_interactions_study_id_fkey", "keyboard_interactions"),
    ("mouse_interactions_study_id_fkey", "mouse_interactions"),
    ("touch_interactions_study_id_fkey", "touch_interactions"),
]

#constraint name, referent table, local_cols
procedure_steps = [
    ("procedure_steps_procedure_id_fkey", "procedures", "procedure_id"),
    ("procedure_steps_condition_id_fkey", "conditions", "condition_id"),
    ("procedure_steps_text_id_fkey", "texts", "text_id"),
    ("procedure_steps_questionnaire_id_fkey", "questionnaires", "questionnaire_id"),
    ("procedure_steps_pause_id_fkey", "pauses", "pause_id")
]

predictions = [
    ("predictions_ml_model_id_fkey", "ml_models", "ml_model_id"),
    ("predictions_participant_id_fkey", "participants", "participant_id"),
    ("predictions_condition_id_fkey", "conditions", "condition_id")
]

questionnaire_results = [
    ("questionnaire_result_participant_id_fkey", "participants", "participant_id"),
    ("questionnaire_result_questionnaire_id_fkey", "questionnaires", "questionnaire_id")
]

participants = [
    ("drag_interactions_participant_id_fkey", "drag_interactions"),
    ("generic_interactions_participant_id_fkey", "generic_interactions"),
    ("keyboard_interactions_participant_id_fkey", "keyboard_interactions"),
    ("mouse_interactions_participant_id_fkey", "mouse_interactions"),
    ("touch_interactions_participant_id_fkey", "touch_interactions"),
]

conditions = [
    ("drag_interactions_condition_id_fkey", "drag_interactions"),
    ("generic_interactions_condition_id_fkey", "generic_interactions"),
    ("keyboard_interactions_condition_id_fkey", "keyboard_interactions"),
    ("mouse_interactions_condition_id_fkey", "mouse_interactions"),
    ("touch_interactions_condition_id_fkey", "touch_interactions"),
]

def upgrade():
    for (constraint, table) in names:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="studies",
            local_cols=["study_id"],
            remote_cols=["id"],
            ondelete="CASCADE")

    for (constraint, referent_table, local_col) in procedure_steps:
        op.drop_constraint(constraint_name=constraint, table_name="procedure_steps", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="procedure_steps",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"],
            ondelete="CASCADE")

    op.drop_constraint(constraint_name="participants_procedure_id_fkey", table_name="participants",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="participants_procedure_id_fkey",
        source_table="participants",
        referent_table="procedures",
        local_cols=["procedure_id"],
        remote_cols=["id"],
        ondelete="SET NULL")

    op.drop_constraint(constraint_name="participants_current_procedure_step_fkey", table_name="participants",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="participants_current_procedure_step_fkey",
        source_table="participants",
        referent_table="procedure_steps",
        local_cols=["current_procedure_step"],
        remote_cols=["id"],
        ondelete="SET NULL")

    for (constraint, table) in participants:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="participants",
            local_cols=["participant_id"],
            remote_cols=["id"],
            ondelete="CASCADE")

    for (constraint, table) in conditions:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="conditions",
            local_cols=["condition_id"],
            remote_cols=["id"],
            ondelete="CASCADE")

    op.drop_constraint(constraint_name="conditions_task_id_fkey", table_name="conditions",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="conditions_task_id_fkey",
        source_table="conditions",
        referent_table="tasks",
        local_cols=["task_id"],
        remote_cols=["id"],
        ondelete="SET NULL")

    #procedure steps foreign keys
    op.drop_constraint(constraint_name="procedure_progress_participant_id_fkey", table_name="procedure_progress",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="procedure_progress_participant_id_fkey",
        source_table="procedure_progress",
        referent_table="participants",
        local_cols=["participant_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.drop_constraint(constraint_name="procedure_progress_procedure_step_id_fkey", table_name="procedure_progress",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="procedure_progress_procedure_step_id_fkey",
        source_table="procedure_progress",
        referent_table="procedure_steps",
        local_cols=["procedure_step_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.drop_constraint(constraint_name="ml_models_condition_id_fkey", table_name="ml_models",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="ml_models_condition_id_fkey",
        source_table="ml_models",
        referent_table="conditions",
        local_cols=["condition_id"],
        remote_cols=["id"],
        ondelete="SET NULL")

    op.drop_constraint(constraint_name="ml_models_condition_id_fkey", table_name="ml_models",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="ml_models_condition_id_fkey",
        source_table="ml_models",
        referent_table="conditions",
        local_cols=["condition_id"],
        remote_cols=["id"],
        ondelete="SET NULL")

    for (constraint, referent_table, local_col) in predictions:
        op.drop_constraint(constraint_name=constraint, table_name="predictions", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="predictions",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"],
            ondelete="CASCADE")

    op.drop_constraint(constraint_name="collaborators_user_id_fkey", table_name="collaborators",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="collaborators_user_id_fkey",
        source_table="collaborators",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    for (constraint, referent_table, local_col) in questionnaire_results:
        op.drop_constraint(constraint_name=constraint, table_name="questionnaire_result", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="questionnaire_result",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"],
            ondelete="CASCADE")

    op.drop_constraint(constraint_name="touch_types_touch_id_fkey", table_name="touch_types",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="touch_types_touch_id_fkey",
        source_table="touch_types",
        referent_table="touches",
        local_cols=["touch_id"],
        remote_cols=["id"],
        ondelete="CASCADE")

    op.drop_constraint(constraint_name="touch_types_touch_interaction_id_fkey", table_name="touch_types",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="touch_types_touch_interaction_id_fkey",
        source_table="touch_types",
        referent_table="touch_interactions",
        local_cols=["touch_interaction_id"],
        remote_cols=["id"],
        ondelete="CASCADE")
    pass


def downgrade():
    for (constraint, table) in names:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="studies",
            local_cols=["study_id"],
            remote_cols=["id"])

    for (constraint, referent_table, local_col) in procedure_steps:
        op.drop_constraint(constraint_name=constraint, table_name="procedure_steps", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="procedure_steps",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"])

    op.drop_constraint(constraint_name="participants_procedure_id_fkey", table_name="participants",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="participants_procedure_id_fkey",
        source_table="participants",
        referent_table="procedures",
        local_cols=["procedure_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="participants_current_procedure_step_fkey", table_name="participants",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="participants_current_procedure_step_fkey",
        source_table="participants",
        referent_table="procedure_steps",
        local_cols=["current_procedure_step"],
        remote_cols=["id"])

    for (constraint, table) in participants:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="participants",
            local_cols=["participant_id"],
            remote_cols=["id"])

    for (constraint, table) in conditions:
        op.drop_constraint(constraint_name=constraint, table_name=table, type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table=table,
            referent_table="conditions",
            local_cols=["condition_id"],
            remote_cols=["id"])

    op.drop_constraint(constraint_name="conditions_task_id_fkey", table_name="conditions",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="conditions_task_id_fkey",
        source_table="conditions",
        referent_table="tasks",
        local_cols=["task_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="procedure_progress_participant_id_fkey", table_name="procedure_progress",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="procedure_progress_participant_id_fkey",
        source_table="procedure_progress",
        referent_table="participants",
        local_cols=["participant_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="procedure_progress_procedure_step_id_fkey", table_name="procedure_progress",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="procedure_progress_procedure_step_id_fkey",
        source_table="procedure_progress",
        referent_table="procedure_steps",
        local_cols=["procedure_step_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="ml_models_condition_id_fkey", table_name="ml_models",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="ml_models_condition_id_fkey",
        source_table="ml_models",
        referent_table="conditions",
        local_cols=["condition_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="ml_models_condition_id_fkey", table_name="ml_models",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="ml_models_condition_id_fkey",
        source_table="ml_models",
        referent_table="conditions",
        local_cols=["condition_id"],
        remote_cols=["id"])

    for (constraint, referent_table, local_col) in predictions:
        op.drop_constraint(constraint_name=constraint, table_name="predictions", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="predictions",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"])

    op.drop_constraint(constraint_name="collaborators_user_id_fkey", table_name="collaborators",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="collaborators_user_id_fkey",
        source_table="collaborators",
        referent_table="users",
        local_cols=["user_id"],
        remote_cols=["id"])

    for (constraint, referent_table, local_col) in questionnaire_results:
        op.drop_constraint(constraint_name=constraint, table_name="questionnaire_result", type_="foreignkey")
        op.create_foreign_key(
            constraint_name=constraint,
            source_table="questionnaire_result",
            referent_table=referent_table,
            local_cols=[local_col],
            remote_cols=["id"])

    op.drop_constraint(constraint_name="touch_types_touch_id_fkey", table_name="touch_types",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="touch_types_touch_id_fkey",
        source_table="touch_types",
        referent_table="touches",
        local_cols=["touch_id"],
        remote_cols=["id"])

    op.drop_constraint(constraint_name="touch_types_touch_interaction_id_fkey", table_name="touch_types",
                       type_="foreignkey")
    op.create_foreign_key(
        constraint_name="touch_types_touch_interaction_id_fkey",
        source_table="touch_types",
        referent_table="touch_interactions",
        local_cols=["touch_interaction_id"],
        remote_cols=["id"])
    pass
