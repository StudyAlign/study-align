# StudyAlign

Monorepo for the **StudyAlign** platform — a system for building, running, and
logging online HCI/AI user studies. Consolidated from five separate GitLab
repositories into one repo with full history preserved.

## Repository layout

```
study-align/
├── apps/
│   ├── backend/           FastAPI + SQLAlchemy + Postgres API (app in backend/app)
│   ├── admin-frontend/    React admin UI — design & manage studies
│   └── study-frontend/    React participant UI — run the study
├── libs/
│   └── study-align-lib/   TypeScript client library (interaction logging)
├── docs/                  Documentation + integration examples
├── compose.yaml           One dev stack for the whole system
└── .env.example           Environment template (copy to .env)
```

| Component | Stack | Dev port |
|-----------|-------|----------|
| backend | FastAPI, SQLAlchemy, Alembic, Postgres | 8000 |
| admin-frontend | React 17, Redux Toolkit, react-router 6, Bootstrap 5 | 3000 |
| study-frontend | React 17, Redux Toolkit, react-router 5, Bootstrap 4 | 3366 |
| study-align-lib | TypeScript, webpack | — |
| LimeSurvey (optional) | third-party, MariaDB | 8082 |

## Quick start

```bash
cp .env.example .env         # then edit: set SECRET_KEY, API_ADMIN_KEY, DB creds
docker compose up            # database + backend + both frontends

# initialise the database (first run only)
docker compose exec backend python /app/init_db.py

# optional: bring up LimeSurvey too
docker compose --profile limesurvey up
```

- Backend API + docs: http://localhost:8000/docs
- Admin frontend: http://localhost:3000
- Study frontend: http://localhost:3366

## Notes

- Secrets live only in `.env` (gitignored). Never commit real keys. Generate
  with `openssl rand -hex 32`.
- The backend application code lives at `apps/backend/backend/app` (the extra
  `backend/` level is preserved from the original repo and can be flattened
  later in a dedicated commit).
- History for every component predates this monorepo — use
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
