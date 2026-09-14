# Production image for the admin frontend.
# Build context is the repo root (the app is part of the npm workspace and
# depends on study-align-lib).

# ---- build ----
FROM node:18-alpine AS build

# Public URLs are baked into the CRA build.
ARG REACT_APP_STUDY_ALIGN_URL
ARG REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL
ENV REACT_APP_STUDY_ALIGN_URL=$REACT_APP_STUDY_ALIGN_URL \
    REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL=$REACT_APP_STUDY_ALIGN_STUDY_FRONTEND_URL \
    CI=false

WORKDIR /repo
COPY . .
RUN npm ci --no-audit --no-fund
# build:admin builds the lib first, then the admin app
RUN npm run build:admin

# ---- serve ----
FROM nginx:1.27-alpine
COPY deploy/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/admin-frontend/build /usr/share/nginx/html
