# Docker Setup

Docker is optional and bonus for this project.

## Current Status

Docker setup is planned but not yet included in the current repository.

The repository currently does not include Dockerfile or Docker Compose files for the backend, frontend, or MongoDB. Because of that, this documentation does not present Docker commands as working commands.

## Prerequisites for Future Docker Setup

- Docker Desktop
- Docker Compose

Verify:

```powershell
docker --version
docker compose version
```

## Intended Future Workflow

After Docker files are added, the intended workflow would be:

1. Build backend container.
2. Build frontend container.
3. Start MongoDB container.
4. Run seed command.
5. Start backend and frontend services.
6. Open the frontend in a browser.

## To Update After Docker Compose Is Added

Document the real commands only after verifying them. The future document should include:

- Dockerfile paths.
- Compose file path.
- Environment variable handling.
- MongoDB volume strategy.
- Seed command.
- Service URLs.
- Shutdown command.
- Troubleshooting for Docker daemon and ports.
