# Deploying StudyAlign

Self-hosted, single-VM deployment: a Dockerised stack deployed by
**`git push` → GitHub webhook → rebuild script**, served behind a **Caddy
container** that terminates TLS on a shared Docker network.

Three public services, each on its own subdomain (change `studyalign.com` to
your domain):

| Subdomain | Container | What it is |
| --- | --- | --- |
| `app.studyalign.com` | `admin-frontend` | Researcher admin app (static SPA) |
| `studies.studyalign.com` | `study-frontend` | Participant app (static SPA) |
| `backend.studyalign.com` | `backend` | FastAPI backend |

Postgres stays private — it never joins the proxy network and has no published
port.

```
          git push (main)
                │  HMAC webhook
                ▼
   webhook daemon ──▶ deploy-studyalign.sh ──▶ git reset --hard + compose up --build --wait
                                                       │
 Internet ─443─▶ Caddy (container on network "web")
                    ├─ app.…      ─▶ admin-frontend:80
                    ├─ studies.…  ─▶ study-frontend:80
                    └─ backend.…  ─▶ backend:80
                                        │  (private "default" network)
                                     database  (never on "web")
```

## Files

```
docker-compose.yml            # DEV stack (node dev servers, hot reload, host ports)
docker-compose.prod.yml       # PROD stack (built static frontends, gunicorn, no ports, "web")
deploy/admin-frontend.Dockerfile   # multi-stage build -> nginx (SPA)
deploy/study-frontend.Dockerfile   # multi-stage build -> nginx (SPA)
deploy/nginx/spa.conf              # SPA config inside the frontend images
deploy/Caddyfile.example           # the three site blocks for the host's Caddy
deploy/webhook.conf.example        # the webhook daemon hook
deploy-studyalign.sh               # the deploy script
.env.example                       # documented; real .env is gitignored on the server
```

> **Dev vs prod.** `docker compose up` still runs the dev stack
> (`docker-compose.yml`). Production is a **separate** file selected with
> `COMPOSE_FILE=docker-compose.prod.yml` (set in the server's `.env`), so on the
> server every bare `docker compose` command uses the prod stack — no `-f` flags.

## Server setup (one time)

```bash
# 1. Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"          # log out / in

# 2. Shared proxy network (before Caddy or the app start)
docker network create web

# 3. Checkout + env
sudo mkdir -p /opt/studyalign && sudo chown "$USER" /opt/studyalign
git clone <repo> /opt/studyalign && cd /opt/studyalign
cp .env.example .env                     # fill in secrets (see below), gitignored
mkdir -p data/postgres data/uploads      # persistent bind mounts

# 4. First deploy
./deploy-studyalign.sh

# 5. Caddy: add deploy/Caddyfile.example to the host Caddy, then reload it
# 6. webhook: add deploy/webhook.conf.example to /etc/webhook.conf, then
#    sudo systemctl restart webhook
```

The webhook user must be in the `docker` group and own `/opt/studyalign`. Deploy
output lands in the journal: `journalctl -u webhook -f`.

Firewall: `ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp`. The app
has **no published port** — traffic only crosses the Docker `web` network via
Caddy.

## `.env` on the server

Copy `.env.example` and set, at minimum:

```ini
COMPOSE_FILE=docker-compose.prod.yml

POSTGRES_USER=studyalign
POSTGRES_PASSWORD=<strong-secret>
POSTGRES_DB=studyalign

SECRET_KEY=<openssl rand -hex 32>
API_ADMIN_KEY=<openssl rand -hex 32>
INITIAL_ADMIN_EMAIL=you@example.com
INITIAL_ADMIN_PW=<strong-secret>

# Public hostnames
CORS_ORIGINS=https://app.studyalign.com,https://studies.studyalign.com
FRONTEND_URL=https://app.studyalign.com          # used in email links (admin app)
PUBLIC_BACKEND_URL=https://backend.studyalign.com
PUBLIC_STUDY_URL=https://studies.studyalign.com/ # trailing slash matters

# Mail (for activation / password-reset / invite emails)
MAIL_USERNAME=…
MAIL_PASSWORD=…
MAIL_FROM=noreply@studyalign.com
MAIL_SERVER=smtp.your-provider.com
MAIL_PORT=587
```

`PUBLIC_BACKEND_URL` and `PUBLIC_STUDY_URL` are **baked into the frontend builds**
(build args), so changing them requires a rebuild (`./deploy-studyalign.sh`).

> **Once-only credentials.** `POSTGRES_PASSWORD` and the seeded admin
> (`INITIAL_ADMIN_*`) are applied only when the database is first created. Editing
> `.env` later does **not** change them — reset them with `ALTER USER … WITH
> PASSWORD` / an admin password reset in the app.

## Deploying

- **A push to `main` deploys itself** via the webhook.
- **By hand** (or after a failed deploy): `./deploy-studyalign.sh`.
- **Roll back**: `git -C /opt/studyalign reset --hard <previous-sha> && ./deploy-studyalign.sh`
  (the failing deploy prints this exact line).

The script single-flights with `flock`, hard-resets to `origin/main`, rebuilds
with `docker compose up -d --build --wait` (gated on the containers'
healthchecks), then verifies `backend /health` through the container. On failure
the previous containers keep running and it prints the rollback command.

## Database & data

- **Tables and the initial admin are created on boot** by `prestart.sh` →
  `initialize.py` (idempotent: it only seeds when the DB is empty), so a deploy
  needs no manual init step.
- **Persistent data is on bind mounts** under `./data/` (Postgres + uploaded
  group logos / ML models), so it survives `docker compose down`.
- **Back up the database *and* `data/uploads` together** — a DB dump alone
  restores rows that point at files that no longer exist. Dump Postgres with
  `pg_dump`, tar `data/uploads`, copy both off the machine, and test a restore
  before you need it.

## TLS

Caddy obtains and renews Let's Encrypt certificates automatically for each
hostname — no certbot needed. Point the three `A`/`AAAA` DNS records
(`app`, `studies`, `backend`) at the VM before the first Caddy reload.
