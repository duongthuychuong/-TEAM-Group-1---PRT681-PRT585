# Taskflow

A minimal task manager with a Vue 3 frontend, an ASP.NET Core API, and SQL Edge persistence. It supports listing, creating, completing, filtering, and deleting tasks.

## Architecture

```text
Browser :8080 -> Nginx/Vue frontend -> /api proxy -> ASP.NET API :8080 -> SQL Edge :1433
```

Docker Compose runs three services:

- `frontend`: serves `wwwroot` with Nginx and proxies `/api` requests.
- `api`: runs the .NET 10 minimal API and Entity Framework Core.
- `azure-sql-edge`: stores tasks in the persistent `azure-sql-edge-data` volume.

## Setup and run with Docker

Prerequisite: Docker Desktop with Docker Compose.

```bash
docker compose up --build -d
```

Open http://localhost:8080. The API is also available directly at http://localhost:5080/api/tasks.

To view status or logs:

```bash
docker compose ps
docker compose logs -f
```

Stop the application without deleting database data:

```bash
docker compose down
```

For a non-default development password, set `MSSQL_SA_PASSWORD` before starting Compose.

## Run the application directly

Prerequisites: .NET 10 SDK and Docker for the database.

```bash
docker compose up -d azure-sql-edge
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
