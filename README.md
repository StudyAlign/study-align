# StudyAlign

Monorepo for the StudyAlign platform, a system for building, running, and
logging online HCI/AI user studies. It was consolidated from five separate
GitLab repositories into one repo, with full history preserved.

## Repository layout

```
study-align/
├── apps/
│   ├── backend/            FastAPI + SQLAlchemy + Postgres API (app in backend/app)
│   ├── admin-frontend/     React admin UI for designing and managing studies
│   └── study-frontend/     React participant UI that runs the study
├── libs/
│   └── study-align-lib/    TypeScript client library for interaction logging
├── docs/                   Documentation, study and questionnaire examples, and
│                           the app-examples submodule (demo prototypes)
├── docker-compose.yml      Dev stack for the whole system
├── docker-compose.prod.yml Production stack (served behind Caddy)
└── .env.example            Environment template (copy to .env)
```

| Component | Stack | Dev port |
|-----------|-------|----------|
| backend | FastAPI, SQLAlchemy, Alembic, Postgres | 8000 |
| admin-frontend | React 19, Redux Toolkit, react-router 6, Bootstrap 5 | 3000 |
| study-frontend | React 19, Redux Toolkit, react-router 6, Bootstrap 5 | 3366 |
| study-align-lib | TypeScript, webpack | n/a |

## Quick start

```bash
cp .env.example .env         # then edit: set SECRET_KEY, API_ADMIN_KEY, DB creds
docker compose up            # database + backend + both frontends

# initialise the database (first run only)
docker compose exec study_align_backend python /app/init_db.py
```

- Backend API and docs: http://localhost:8000/docs
- Admin frontend: http://localhost:3000
- Study frontend: http://localhost:3366

The compose services are named `study_align_backend`,
`study_align_admin_frontend`, and `study_align_study_frontend`.

## Surveys / questionnaires

Studies can embed questionnaires from an **external** survey tool (LimeSurvey or
Qualtrics). StudyAlign does not bundle or host a survey instance: you point a
study at your own LimeSurvey/Qualtrics by entering its survey URL and API
credentials per study in the admin app. See
[`docs/examples/README.md`](docs/examples/README.md) for ready-to-import
LimeSurvey `.lss` examples, and [`docs/native-questionnaires.md`](docs/native-questionnaires.md)
for StudyAlign's built-in (native) questionnaires.

## Example prototypes (submodule)

The instrumented demo prototypes live in a submodule at `docs/app-examples`
(https://github.com/StudyAlign/app-examples). It contains a React and a vanilla
JavaScript app, each wiring `study-align-lib` into a small editor. Fetch it with:

```bash
git submodule update --init docs/app-examples
```

## Notes

- Secrets live only in `.env` (gitignored). Never commit real keys. Generate
  them with `openssl rand -hex 32`.
- The backend application code lives at `apps/backend/backend/app`. The extra
  `backend/` level is preserved from the original repo and can be flattened
  later in a dedicated commit.
- History for every component predates this monorepo. Use
  `git log --follow <path>` to trace a file across the consolidation.

## History

This repo was assembled from, and supersedes, these now-archived repositories:

| Archived repo | Now at |
|---------------|--------|
| `study-align-backend` | `apps/backend` |
| `study-align-admin-frontend` | `apps/admin-frontend` |
| `study-align-study-frontend` | `apps/study-frontend` |
| `study-align-lib` | `libs/study-align-lib` |
| `studyalign-docs` | `docs` |
