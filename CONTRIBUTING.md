# Contributing to StudyAlign

Thanks for your interest in improving StudyAlign! Contributions of all kinds are
welcome — bug reports, documentation, and code.

## Ways to contribute

- **Report a bug or request a feature** via a GitHub issue. Include steps to
  reproduce, what you expected, and what happened.
- **Improve the docs** — the documentation lives in [`docs/`](docs/README.md).
- **Contribute code** via a pull request (see below).
- **Report a security issue** privately — see [SECURITY.md](SECURITY.md), not a
  public issue.

## Development setup

Requires Docker and Docker Compose. The whole stack runs from the repo root:

```bash
cp .env.example .env         # set SECRET_KEY, API_ADMIN_KEY, DB creds
docker compose up            # database + backend + both frontends

# first run only: create tables and the initial admin user
docker compose exec study_align_backend python /app/init_db.py
```

- Backend API + interactive docs: http://localhost:8000/docs
- Control panel (admin frontend): http://localhost:3000
- Study frontend: http://localhost:3366

The frontends hot-reload; the backend runs with `--reload`. See
[DEPLOYMENT.md](DEPLOYMENT.md) for the production stack.

### Building the client library

This is an npm-workspaces monorepo, and `webpack` (a dev dependency of
`study-align-lib`) is installed inside the dev containers, not on the host.
Build the library from the running admin container:

```bash
docker compose exec study_align_admin_frontend npm run build:lib
```

The bundle is written to `libs/study-align-lib/dist/` (on the host via the bind
mount). Publishing to npm is documented separately; the library is MIT-licensed.

## Pull requests

- **Branch per issue**, named `issue/<ID>-short-description` (a few words).
- Keep PRs focused; describe the change and link the issue it addresses.
- **Match the surrounding code style** — follow the conventions already used in
  the file and component you are editing rather than introducing new ones.
- Make sure the relevant app still builds and runs (frontends compile without
  new warnings; the backend starts and `/health` responds).
- Commit messages: a short imperative summary (e.g. `fix(admin): …`), with a
  body explaining the *why* when it isn't obvious.

## Repository notes

- The backend application code lives at `apps/backend/backend/app` — the extra
  `backend/` level is preserved from the original repository.
- History predates this monorepo; use `git log --follow <path>` to trace a file
  across the consolidation from the original per-component repositories.
- Secrets live only in `.env` (gitignored). **Never commit real keys**; generate
  them with `openssl rand -hex 32`.

## Licensing of contributions

By contributing, you agree that your contributions are licensed under the same
license as the component you are modifying (see [LICENSE](LICENSE)): **MIT** for
`libs/study-align-lib`, **AGPL-3.0-only** for the backend and the two frontends.
