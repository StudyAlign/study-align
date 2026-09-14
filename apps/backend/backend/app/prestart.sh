#!/usr/bin/env sh
# Runs before the server starts (the tiangolo uvicorn-gunicorn-fastapi base
# image executes /app/prestart.sh automatically). The dev stack overrides the
# container command with `uvicorn --reload`, so this only runs in production.
set -e

echo "prestart: initializing database ..."
python initialize.py
echo "prestart: done."
