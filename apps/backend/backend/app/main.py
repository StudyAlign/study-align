from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from decouple import config
import logging

from api.v1 import studies, conditions, procedures, tasks, texts, questionnaires, participants, procedure_steps, \
    users, interaction, machine_learning, pauses, procedure_configs, collaborators, groups

logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger('studyalign')


API_PREFIX = "/api/v1"

app = FastAPI(title="study-align-api", version="1")

# read allowed cors origins from .env file
origins = config('CORS_ORIGINS', cast=lambda v: [s.strip() for s in v.split(',')])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    users.router,
    prefix=API_PREFIX,
    tags=["Users"]
)

app.include_router(
    groups.router,
    prefix=API_PREFIX,
    tags=["Groups"]
)

app.include_router(
    collaborators.router,
    prefix=API_PREFIX,
    tags=["Collaborators"]
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
    procedure_configs.router,
    prefix=API_PREFIX,
    tags=["ProcedureConfigs"]
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
    pauses.router,
    prefix=API_PREFIX,
    tags=["Pauses"]
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
