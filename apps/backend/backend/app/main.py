from fastapi import FastAPI
import logging

from api.v1 import studies, conditions, procedures, tasks, texts, questionnaires, participants, procedure_steps, \
    admin, interaction, machine_learning

logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger('studyalign')


API_PREFIX = "/api/v1"

app = FastAPI(title="study-align-api", version="1")


app.include_router(
    admin.router,
    prefix=API_PREFIX,
    tags=["Admin"]
)

app.include_router(
    studies.router,
    prefix=API_PREFIX,
    tags=["Studies"]
)

app.include_router(
    conditions.router,
    prefix=API_PREFIX,
    tags=["Conditions"]
)

app.include_router(
    procedures.router,
    prefix=API_PREFIX,
    tags=["Procedures"]
)

app.include_router(
    procedure_steps.router,
    prefix=API_PREFIX,
    tags=["ProcedureSteps"]
)

app.include_router(
    participants.router,
    prefix=API_PREFIX,
    tags=["Participants"]
)

app.include_router(
    tasks.router,
    prefix=API_PREFIX,
    tags=["Tasks"]
)

app.include_router(
    texts.router,
    prefix=API_PREFIX,
    tags=["Texts"]
)

app.include_router(
    questionnaires.router,
    prefix=API_PREFIX,
    tags=["Questionnaires"]
)

app.include_router(
    interaction.router,
    prefix=API_PREFIX,
    tags=["Interactions"]
)

app.include_router(
    machine_learning.router,
    prefix=API_PREFIX,
    tags=["Machine Learning"]
)
