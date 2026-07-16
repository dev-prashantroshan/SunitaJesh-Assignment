# Docker Setup

The verified Docker Compose setup runs MongoDB 7, the compiled Express backend, and the Vite frontend served by NGINX.

## Prerequisites

- Docker Desktop
- Docker Compose v2

Confirm Docker Desktop is running:

```powershell
docker --version
docker compose version
docker ps
```

If `docker ps` cannot connect to the Docker API, start or restart Docker Desktop and wait for its engine to become ready.

## Start the Application

From the repository root, build and start all services with one command:

```powershell
docker compose up -d --build
```

MongoDB must become healthy before the backend starts. Compose then starts the frontend after the backend container has started.

Seed the database explicitly after the first startup:

```powershell
docker compose exec backend npm run seed
```

Seeding is intentionally not automatic because it clears and repopulates the application collections.

## Service URLs and Ports

| Service | Address |
| --- | --- |
| Frontend | `http://localhost:5173` |
| Backend health | `http://localhost:5000/api/health` |
| Backend API | `http://localhost:5000/api` |
| MongoDB host port | `localhost:27017` |

The frontend is built with `VITE_API_BASE_URL=http://localhost:5000`, which is reachable by the user's browser. NGINX serves static assets and falls back to `index.html` for React Router routes.

## CodeSandbox

CodeSandbox has removed GitHub repository import for this workflow. Create a Docker sandbox, then clone the public GitHub repository in the sandbox terminal and enter the repository directory.

Start the CodeSandbox variant, which builds the frontend with an empty API base URL so its existing `/api` endpoint paths remain same-origin and are proxied to the backend service:

```bash
docker compose -f docker-compose.yml -f docker-compose.codesandbox.yml up --build -d
```

Seed MongoDB explicitly:

```bash
docker compose -f docker-compose.yml -f docker-compose.codesandbox.yml exec backend npm run seed
```

Open the frontend port exposed by CodeSandbox from its preview panel. The alternate Compose file does not change the normal local `docker compose up --build` behavior.

## Status and Logs

```powershell
docker compose ps
docker compose logs -f
```

To follow one service only:

```powershell
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongo
```

## Stop and Restart

Stop and remove the containers and network:

```powershell
docker compose down
```

The named `mongo-data` volume remains, so seeded data persists across `down` and the next startup:

```powershell
docker compose up -d
```

## Reset the Database

This destructive reset removes the MongoDB volume and all stored application data:

```powershell
docker compose down -v
docker compose up -d
docker compose exec backend npm run seed
```

Use `down -v` only when a complete database reset is intended.

## Rebuild Images

Rebuild after Dockerfile, dependency, frontend environment, or application source changes:

```powershell
docker compose build
docker compose up -d
```

To force a clean image build:

```powershell
docker compose build --no-cache
docker compose up -d
```

## Port Conflicts

The setup requires host ports `5173`, `5000`, and `27017`. If Compose reports that a port is already allocated:

1. Stop the local frontend, backend, or MongoDB process using that port.
2. Check existing containers with `docker ps`.
3. Stop an old Compose stack with `docker compose down` from its project directory.
4. Run `docker compose up -d` again.

## Docker Daemon Troubleshooting

If commands report that they cannot connect to `docker_engine` or the Docker API:

1. Open Docker Desktop.
2. Wait until the engine reports that it is running.
3. Run `docker ps`.
4. Restart Docker Desktop if the error continues.

Inspect startup failures with:

```powershell
docker compose ps
docker compose logs backend
docker compose logs mongo
```

The backend waits for the Mongo health check, but application readiness can take a brief additional moment while Mongoose connects.
