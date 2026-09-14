# Production image for the study (participant) frontend.
# Build context is the repo root (npm workspace + study-align-lib).

# ---- build ----
FROM node:18-alpine AS build

ARG REACT_APP_STUDY_ALIGN_URL
ENV REACT_APP_STUDY_ALIGN_URL=$REACT_APP_STUDY_ALIGN_URL \
    CI=false

WORKDIR /repo
COPY . .
RUN npm ci --no-audit --no-fund
# build:study builds the lib first, then the study app
RUN npm run build:study

# ---- serve ----
FROM nginx:1.27-alpine
COPY deploy/nginx/spa.conf /etc/nginx/conf.d/default.conf
COPY --from=build /repo/apps/study-frontend/build /usr/share/nginx/html
