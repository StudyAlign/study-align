# Get Started

## Conventions:
- **A procedure must start and end with a TEXT step!**

## What is missing
- [ ] Prolific Link
- [ ] Logo Upload for study
- [ ] Roles (for users, study permissions)
- [ ] Duplicate Study (without participants)
- [ ] Demo / Test mode

## Run application
1. Create a docker network by making the shell script create-network.sh executable `sudo chmod +x create-network.sh` and 
   running it `./create-network.sh`.
2. Start nginx: Open a new shell window, change the directory to `loadbalancer`, execute: `docker-compose up`
3. Start limesurvey: Open a new shell window, change the directory to `limesurvey`, execute: `docker-compose up`
4. Start study-align: Open a new shell window, execute `docker-compose up` from the project's root folder
   1. On production, run: `docker-compose -f docker-compose.prod.yml up`
   2. On dev, run: `docker-compose -f docker-compose.dev.yml up`
Access limesurvey locally through `http://localhost:8082`.
Access the studyalign backend locally through `http://localhost:8080`
Note: In future, the studyalign frontend will be served through `http://localhost:8081`

## Limesurvey Configuration & Survey Workflow

### 1. Activate JSON RPC
Login with the admin credentials and activate JSON RPC, see: https://manual.limesurvey.org/RemoteControl_2_API.

### 2. Global survey configuration
Go to "Global survey settings", e.g. (https://yourinstance.com/index.php/admin/globalsettings/sa/surveysettings/partial/_tokens_panel) . Modify the settings as follows:
- Set access code length to: 36
- Enable participant-based response persistence: On
- Send confirmation emails: Off

This way every survey, which will be created in future, is going to inherit the configuration.
It is crucial to keep these settings. Otherwise studies will not work properly!

### 3. Create survey administrator for RPC
Create a separate survey administrator, grant only rights for "Use internal database authentication".
The user is needed for remote procedure calls. This way our system communicates with a limesurvey instance.

## Limesurvey Workflow
- Create surveys in limesurvey
- When editing a survey, go to "Survey permissions". Add the RPC survey administrator.
- In the following view, grant rights to "create AND view/read Participants" and "export Responses"
- Finally, when adding a survey in studyalign, provide the credentials to the RPC survey admin as follows:
```
{"username": "name_of_rpc_admin", "password": "password_of_rpc_user"}
```

## Architecture Overview
We run all containers on one host.
The services `limesurvey` and `studyctrl-backend` will be attached to the `studyctrl-network`. As well, will be 
the nginx service `studyctrl-nginx`. The nginx serves as a reverse proxy to balance network requests.

By executing `docker network inspect studyctrl-network` from the shell you can see the details about the 
`studyctrl-network`. The `studyctrl-network` is accessible from outside, e.g. via port 443 (SSL). Whereas we isolate
the limesurvey mariadb and the studyalign postgres and make it only available within a container.

The limesurvey instance, and the studyalign instance run in separate containers. 

## Set up .env
Create a `.env` file in the root (app) folder. Then copy paste the key-value pairs below:

```
SECRET_KEY = "4307fff64d15d8366384e22cb48f8d4f6fc3bd74c89eb19a1c93bdfc5f94434d"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 120
API_ADMIN_KEY = "73d088b3ce965980dcb1ccf3b5b63b54cafb93232ab0889151c52207fe5a104b"
INITIAL_ADMIN_PW = "StudyAlignInitialLogin"

CORS_ORIGINS = "http://localhost:*, http://localhost, http://localhost:8080, http://localhost:63343, http://localhost:3333, http://localhost:3000, http://localhost:3366"
```

These key-value pairs are mainly used for authentication (issuing and validating of JWT tokens). In a production 
environment they would be replaced accordingly. Configuration of env variables might differ between hosting services.

## Database
To initialise the database `cd backend` and execute: `docker exec -it studyctrl-backend python /app/init_db.py`
On dev you would run: `docker exec -it studyctrl-backend-dev python /app/init_db.py`

You can connect to the database with a tool like DataGrip. You will find the development credentials within 
`database/database.env`, e.g. using the url: `jdbc:postgresql://localhost:5433/postgres`.
The port 5433 gets mapped to port 5432 in the database container.

### Migrations
Since we are using SQLalchemy with alembic for migrating, check out the official tutorial: https://alembic.sqlalchemy.org/en/latest/tutorial.html

#### Create migrations
```commandline
docker exec -it studyctrl-backend alembic revision -m "short description of migration"
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

# Predictions

## Distributable Models, e.g. tensorflow js

coming soon

## Predictions with models hosted on another VM aka. study-align-prediction

If you decide to host your machine learning model on a separate VM, use the study-align-prediction example project.

You can run the VM locally with `docker-compose up` as well. When adding a model to the database enter
the URL `http://172.17.0.1:8081/api/v1`. This way the services are able to communicate with each other.

# Interaction Logging

## Mouse Interactions:

- relatedTarget property is optional and must be created manually => see createMouseInteraction() in frontend lib.
