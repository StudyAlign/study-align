# Get Started with the StudyAlign Backend

## Conventions: A Study procedure must start and end with a TEXT step!

## Before running the application, set up the .env and database.env files!

## Set up .env
Create a `.env` file in the root (app) folder. Then edit the following key-value pairs and paste them into
the paste them into the previously created env file.

```
SECRET_KEY = "4307fff64d15d8366384e22cb48f8d4f6fc3bd74c89eb19a1c93bdfc5f94434d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
API_ADMIN_KEY = "73d088b3ce965980dcb1ccf3b5b63b54cafb93232ab0889151c52207fe5a104b"
INITIAL_ADMIN_PW = "AlignStudiesPassword"
INITIAL_ADMIN_EMAIL = "norply@studyalign.com"

CORS_ORIGINS = "http://localhost:*, http://localhost, http://localhost:8080, http://localhost:63343, http://localhost:3333, http://localhost:3000, http://localhost:3366"
```

These key-value pairs are mainly used for authentication (issuing and validating of JWT tokens). In a production 
environment they would be replaced accordingly. Configuration of env variables might differ between hosting services.

## Database
Create a `database.env` file in the database directory and paste the content from below. 
Docker-compose reads values from these files. For a prod or dev environment
you would create a database.prod.env or databse.dev.env.

Replace YOUR-USER and YOUR-PASSWORD with unique credentials (also in the SQLALCHEMY_DB_URL value).

```
POSTGRES_USER=YOUR-USER
POSTGRES_PASSWORD=YOUR-PASSWORD
POSTGRES_DB=studyalign
SQLALCHEMY_DB_URL=postgresql+psycopg2://YOUR-USER:YOUR-PASSWORD@studyalign-database/studyalign
```

To initialize the database `cd backend` and execute: `docker exec -it studyalign-backend python /app/init_db.py`
On another instance, e.g. dev you would run: `docker exec -it studyalign-backend-dev python /app/init_db.py`

You can connect to the database with a tool like DataGrip. You will find the development credentials within 
`database/database.env`, e.g. using the url: `jdbc:postgresql://localhost:5433/postgres`.
The port 5433 gets mapped to port 5432 in the database container.

## Run application

> This backend-only guide is legacy (pre-monorepo). For the full dev stack use
> the root `docker-compose.yml` and the top-level `README.md`.
>
> Surveys are external: a study points at your own LimeSurvey/Qualtrics
> (configured per study in the admin app); the platform hosts no survey tool.

1. Create a docker network by making the shell script create-network.sh executable `sudo chmod +x create-network.sh` and 
   running it `./create-network.sh`.
2. Start nginx: Open a new shell window, change the directory to `loadbalancer`, execute: `docker-compose up`
3. Start StudyAlign: Open a new shell window, execute `docker-compose up` from the project's root folder
   1. On production, run: `docker-compose -f docker-compose.prod.yml up`
   2. On dev, run: `docker-compose -f docker-compose.dev.yml up`

Access the StudyAlign backend locally through `http://localhost:8080`


## Database Migrations
Since we are using SQLalchemy with alembic for migrations, check out the official tutorial: https://alembic.sqlalchemy.org/en/latest/tutorial.html

### Create migrations
```commandline
docker exec -it studyalign-backend alembic revision -m "short description of migration"
```

### Execute migrations
When the docker containers are running:
```
docker exec -it studyalign-backend alembic upgrade head
```
This is executing all migrations up to the latest.

# Participants

## Sample tokens:

```
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNTc3NjVmNy0yYTIxLTRkMzMtYTNmMC1hYmNkZjdkZmM0MTIiLCJleHAiOjE1OTY3MjQzMzB9.tQ6clupKwY5YfmD7p7xQBWjx22O0dNAF5q6iCnVWZos",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmNTc3NjVmNy0yYTIxLTRkMzMtYTNmMC1hYmNkZjdkZmM0MTIiLCJyZWZyZXNoIjp0cnVlLCJleHAiOjkxMDE2MjQwMTZ9.wPaN3NMUU2n4ST3tjpuz0ZfPALK3dO3TZ6wzW9zPY7g",
  "token_type": "bearer"
}
```

## Architecture Overview
We run all containers on one host.

The `studyalign-backend` service is attached to the `studyalign-network`, as is
the nginx service `studyalign-nginx`. The nginx serves as a reverse proxy to balance network requests.

By executing `docker network inspect studyalign-network` from the shell you can see the details about the 
`studyalign-network`. The `studyalign-network` is accessible from outside, e.g. via port 443 (SSL). Whereas we isolate 
StudyAlign's postgres and make it only available within a container.

## Predictions with models hosted on another VM aka. study-align-prediction

If you decide to host your machine learning model on a separate VM, use the study-align-prediction example project.

You can run the VM locally with `docker-compose up` as well. When adding a model to the database enter
the URL `http://172.17.0.1:8081/api/v1`. This way the services are able to communicate with each other.

# Interaction Logging

## Mouse Interactions:

- relatedTarget property is optional and must be created manually => see createMouseInteraction() in frontend lib.