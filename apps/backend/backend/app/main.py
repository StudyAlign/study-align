from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from decouple import config
import logging

from api.v1 import studies, conditions, procedures, tasks, texts, questionnaires, participants, procedure_steps, \
    users, interaction, machine_learning, pauses, procedure_configs, collaborators, groups

logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger('studyalign')


API_PREFIX = "/api/v1"

# Default docs are disabled so they can be re-served below with the orb favicon.
app = FastAPI(title="study-align-api", version="1", docs_url=None, redoc_url=None)

# Static assets (favicon lives here). Directory is relative to the app's CWD
# (/app), where static/orb.svg is shipped.
app.mount("/static", StaticFiles(directory="static"), name="static")

FAVICON_PATH = "static/orb.svg"


@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return FileResponse(FAVICON_PATH, media_type="image/svg+xml")


@app.get("/docs", include_in_schema=False)
def custom_swagger_ui_html():
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=app.title + " - Swagger UI",
        swagger_favicon_url="/static/orb.svg",
    )


@app.get("/redoc", include_in_schema=False)
def custom_redoc_html():
    return get_redoc_html(
        openapi_url=app.openapi_url,
        title=app.title + " - ReDoc",
        redoc_favicon_url="/static/orb.svg",
    )

# Allowed CORS origins from .env: comma-separated EXACT origins (scheme + host
# [+ port]), e.g. "https://app.studyalign.com,https://studies.studyalign.com".
# Browser Origin headers never carry a trailing slash, so strip one if a URL was
# pasted with it; also drop surrounding whitespace and empty entries.
origins = config('CORS_ORIGINS', default='', cast=lambda v: [o.strip().rstrip('/') for o in v.split(',') if o.strip()])

# Products/prototypes instrumented with study-align-lib log interactions from
# arbitrary origins that can't be enumerated. CORS_ORIGIN_REGEX allows those:
# an origin is accepted if it is in CORS_ORIGINS OR matches this regex. Unlike
# "*", a regex echoes the matched origin, so it still works with credentials.
#   e.g.  CORS_ORIGIN_REGEX=https://.*   (allow any https origin)
# Leave it unset for a locked-down deployment (exact origins only).
origin_regex = config('CORS_ORIGIN_REGEX', default=None) or None

if "*" in origins:
    logger.warning("CORS_ORIGINS contains '*'. A wildcard is incompatible with "
                   "allow_credentials=True; use CORS_ORIGIN_REGEX (e.g. 'https://.*') "
                   "instead — it echoes the origin and works with credentials.")
if not origins and not origin_regex:
    logger.warning("CORS_ORIGINS and CORS_ORIGIN_REGEX are both empty — cross-origin "
                   "browser requests (incl. interaction logging) will be blocked.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", tags=["Health"])
def health():
    # Lightweight liveness probe used by the container healthcheck and the
    # deploy script.
    return {"ok": True}

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
