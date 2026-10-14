# Security Policy

## Reporting a vulnerability

If you discover a security vulnerability in StudyAlign, please report it
**privately** so it can be fixed before public disclosure.

- Email **contact@studyalign.com** with a description of the issue.
- Please do **not** open a public GitHub issue, pull request, or discussion for
  security problems.

Where possible, include:

- the affected component (backend, admin-frontend, study-frontend, or
  study-align-lib) and version/commit,
- steps to reproduce or a proof of concept,
- the impact you were able to demonstrate.

We will acknowledge your report, keep you informed about the fix, and credit you
if you would like once the issue is resolved.

## Supported versions

StudyAlign is developed on the `main` branch, and security fixes are applied
there. If you run a deployment, track `main` (or a recent commit) to receive
fixes. The `study-align-lib` package follows [semantic versioning](https://semver.org/)
on npm; upgrade to the latest release for fixes.

## Operational hardening

When self-hosting, follow the guidance in [DEPLOYMENT.md](DEPLOYMENT.md):

- generate strong, unique secrets (`SECRET_KEY`, `API_ADMIN_KEY`) with
  `openssl rand -hex 32`, and never commit `.env`;
- keep the database off the public network (the production stack does this by
  default);
- serve everything over TLS (the production stack terminates TLS at Caddy).
