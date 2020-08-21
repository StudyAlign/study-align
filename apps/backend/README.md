# Get Started

## What is missing

- [ ] Roles (for users, study permissions)

## Run application
```commandline
docker-compose up
```

## Set up .env

Create a `.env` file in the root (app) folder. Then copy paste the key-value pairs below:

```
SECRET_KEY = "4307fff64d15d8366384e22cb48f8d4f6fc3bd74c89eb19a1c93bdfc5f94434d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
API_ADMIN_KEY = "73d088b3ce965980dcb1ccf3b5b63b54cafb93232ab0889151c52207fe5a104b"
```

These key-value pairs are mainly used for authentication (issuing and validating of JWT tokens). In a production 
environment they would be replaced accordingly. Configuration of env variables might differ between hosting services.

## Database
To initialise the database, execute: `docker exec -it studyctrl-backend python /app/init_db.py`

You can connect to the database with a tool like DataGrip. You will find the development credentials within 
`database/database.env`, e.g. using the url: `jdbc:postgresql://localhost:5433/postgres`.
The port 5433 gets mapped to port 5432 in the database container.

### Migrations
Since we are using SQLalchemy with alembic for migrating, check out the official tutorial: https://alembic.sqlalchemy.org/en/latest/tutorial.html

#### Create migrations
Activate the python virtual environment locally in `backend/app`. Ensure that you are running Python 3.8.
```commandline
source venv/bin/activate
alembic revision -m "description of the the migration"
```

#### Execute migrations
When the docker containers are running:
```
docker exec -it studyctrl-backend alembic upgrade head
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