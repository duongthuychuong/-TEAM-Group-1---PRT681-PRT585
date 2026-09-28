# Taskflow

A task manager with a Vue 3 frontend, an ASP.NET Core API, SQL Edge persistence, durable email notifications through Temporal and MailKit, structured logs in Seq, and optional unhandled-exception reporting through Exceptionless.

## Architecture

```text
Browser :8080 -> Nginx/Vue -> ASP.NET API -> SQL Edge
                                      |----> Temporal -> MailKit -> Mailpit
                                      `----> Seq
```

Docker Compose runs these services:

- `frontend`: serves `wwwroot` with Nginx and proxies `/api` requests.
- `api`: runs the .NET 10 minimal API and the Temporal worker in a non-root Alpine container.
- `azure-sql-edge`: stores tasks in the persistent `azure-sql-edge-data` volume.
- `temporal`: provides the local Temporal development server and UI.
- `mailpit`: captures local SMTP messages without sending real email.
- `seq`: stores and queries structured application logs.

## Setup and run with Docker

Prerequisite: Docker Desktop with Docker Compose.

```bash
docker compose up --build -d
```

Local endpoints:

| Service | URL |
| --- | --- |
| Application | http://localhost:8080 |
| API | http://localhost:5080/api/tasks |
| API readiness | http://localhost:5080/health/ready |
| API liveness | http://localhost:5080/health/live |
| Seq (`admin` / `TaskflowSeq!Dev1234`) | http://localhost:5341 |
| Temporal UI | http://localhost:8233 |
| Mailpit | http://localhost:8025 |

To view status or logs:

```bash
docker compose ps
docker compose logs -f api
curl --fail http://localhost:5080/health/live
curl --fail http://localhost:5080/health/ready
```

Both health endpoints return HTTP 200 when healthy. Readiness also verifies the database connection and is the health check built into the API image.

### Verify the notification workflow and logs

Create a task. `notificationEmail` is optional and defaults to `NOTIFICATION_EMAIL` from Compose.

```bash
curl --fail-with-body \
  --request POST http://localhost:5080/api/tasks \
  --header 'Content-Type: application/json' \
  --data '{"title":"Verify integrations","description":"Temporal + SMTP + Seq","notificationEmail":"developer@taskflow.local"}'
```

Then:

1. Open Mailpit at http://localhost:8025 and confirm the task-created email arrived.
2. Open Temporal at http://localhost:8233 and inspect the `TaskCreatedEmailWorkflow` execution.
3. Open Seq at http://localhost:5341 and search for `TaskId is not null` or `WorkflowId is not null`.

The workflow activity has exponential retries (up to five attempts), so temporary SMTP failures do not block the HTTP request thread or lose the orchestration state.

Stop the application without deleting database data:

```bash
docker compose down
```

For a non-default development password, set `MSSQL_SA_PASSWORD` before starting Compose. The other useful environment variables are:

| Variable | Purpose |
| --- | --- |
| `NOTIFICATION_EMAIL` | Default recipient for task-created alerts |
| `EXCEPTIONLESS_API_KEY` | Enables Exceptionless unhandled-exception reporting |
| `EXCEPTIONLESS_SERVER_URL` | Optional self-hosted Exceptionless collector URL |
| `SEQ_ADMIN_PASSWORD_HASH` | Override the default Seq `admin` password hash for shared environments |

Exceptionless is intentionally disabled when its API key is empty. Request and exception logs still go to the console and Seq.

## Run the application directly

Prerequisites: .NET 10 SDK plus SQL Edge, Temporal, Seq, and Mailpit. The easiest way to start only those dependencies is:

```bash
docker compose up -d azure-sql-edge temporal seq mailpit
dotnet run --urls http://localhost:5080
```

Open http://localhost:5080. In this mode ASP.NET Core serves both the API and the frontend from `wwwroot`.
The local launch profile uses the `Development` environment, where the API creates the configured database when it is missing. Azure runs in `Production` and connects only to the database supplied through `TASKS_CONNECTION_STRING`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/tasks` | List tasks |
| `POST` | `/api/tasks` | Create a task |
| `PUT` | `/api/tasks/{id}` | Update or complete a task |
| `DELETE` | `/api/tasks/{id}` | Delete a task |
| `GET` | `/health/live` | Process liveness |
| `GET` | `/health/ready` | Database-backed readiness |

`POST /api/tasks` accepts `title`, `description`, and an optional `notificationEmail`. A successful create starts a Temporal workflow and returns the created task immediately; the workflow performs SMTP delivery asynchronously.
