# Fitness Assessment Full-Stack Project

A MERN-style fitness assessment application with a TypeScript/Express/MongoDB backend and a React/Vite mobile-focused frontend.

The project lets a sample user complete onboarding questions, view a personalized journey dashboard, open a running dashboard, inspect an activity tracking screen, and view an expanded running route.

## Main Flow

1. Start at `/onboarding/2`.
2. Complete or skip onboarding Steps 2 through 8.
3. Arrive at `/journey` for the personalized journey screen.
4. Open `/journey/running` for the running-selected dashboard.
5. Open `/running/activity` for the activity tracking screen.
6. Expand the map to `/running/route` or `/running/route/:runId`.

## Implemented Features

- Backend health, onboarding, journey, favorite, run, route, and placeholder-content APIs.
- MongoDB models and seed data for steps, journeys, favorites, and runs.
- Standard success and error response envelopes.
- Device-based identity through `x-device-id`.
- Idempotent favorite and unfavorite endpoints.
- Bacon Ipsum placeholder content normalized through the backend with a five-minute in-memory cache.
- Jest/Supertest backend integration tests.
- Postman collection for all backend endpoints.
- React mobile frontend with onboarding, journey, running dashboard, activity tracking, and route screens.
- API-driven onboarding and running data.
- Step deselection, back navigation, skip navigation, and Step 6 detail clearing.

## Technology Stack

| Area | Tools |
| --- | --- |
| Backend | Node.js 18+, Express, TypeScript, Mongoose, MongoDB |
| Frontend | React, TypeScript, Vite, React Router, CSS Modules, Lucide React |
| Testing | Jest, Supertest, dedicated MongoDB test database |
| API tools | Postman collection |
| Styling | Plus Jakarta Sans, CSS variables, CSS Modules |

## Architecture

```text
Browser
  -> React frontend at http://localhost:5173
  -> Express API at http://localhost:5000
  -> Controllers
  -> Services
  -> Mongoose models
  -> MongoDB
```

The frontend reads `VITE_API_BASE_URL`. The backend reads `PORT`, `MONGODB_URI`, and `MONGODB_TEST_URI`.

## Repository Structure

```text
backend/
  postman/
  src/
    config/
    constants/
    controllers/
    errors/
    middleware/
    models/
    routes/
    seed/
    services/
    utils/
  tests/
frontend/
  public/assets/
  src/
    components/common/
    pages/
    styles/
docs/
  demo/
  deployment/
  testing/
```

Generated folders such as `node_modules/`, `dist/`, and local browser verification folders are not part of the source design.

## Prerequisites

Install these before setup:

- Node.js 18 or newer. This includes npm.
- Git.
- MongoDB Community Server or a MongoDB Atlas connection string.
- Optional: Postman for manual API testing.
- Optional: Docker Desktop. Docker setup is planned optional setup and is not implemented in this repository yet.

Verify installations in PowerShell:

```powershell
node --version
npm --version
git --version
mongod --version
docker --version
docker compose version
```

If Docker commands fail, that is acceptable for this project because Docker files are not included yet.

## Local Setup

Open PowerShell in the repository root.

Install backend dependencies:

```powershell
cd backend
npm install
Copy-Item .env.example .env
```

Edit `backend/.env` if needed:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment-test
NODE_ENV=development
```

Install frontend dependencies:

```powershell
cd ..\frontend
npm install
Copy-Item .env.example .env
```

Edit `frontend/.env` if needed:

```text
VITE_API_BASE_URL=http://localhost:5000
```

## MongoDB

For local MongoDB, make sure the MongoDB service is running. If you use MongoDB Atlas, replace `MONGODB_URI` and `MONGODB_TEST_URI` with Atlas connection strings. Keep the test database separate from development.

## Seed the Database

From `backend/`:

```powershell
npm run seed
```

This inserts Steps 2-8, four journeys, and two runs for sample device `device-thomas-001`.

## Start the Apps

Terminal 1, backend:

```powershell
cd backend
npm run dev
```

Terminal 2, frontend:

```powershell
cd frontend
npm run dev
```

Open:

- Frontend: `http://localhost:5173`
- Backend health: `http://localhost:5000/api/health`

## Build and Test

Backend build:

```powershell
cd backend
npm run build
```

Backend tests:

```powershell
cd backend
$env:MONGODB_TEST_URI="mongodb://127.0.0.1:27017/sunita-jesh-assignment-test"
npm run test
```

Frontend build:

```powershell
cd frontend
npm run build
```

## Postman

Collection path:

```text
backend/postman/fitness-assessment.postman_collection.json
```

Collection variables:

| Variable | Value |
| --- | --- |
| `baseUrl` | `http://localhost:5000` |
| `deviceId` | `device-thomas-001` |
| `journeyId` | Set from `GET /api/journeys` |
| `runId` | Set from `GET /api/runs/current` |

## API Endpoint Summary

| Method | Path | Device header | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | No | Health check |
| GET | `/api/steps` | No | List onboarding steps |
| GET | `/api/steps/:stepId` | No | Get one step |
| GET | `/api/onboarding` | Yes | Saved answers and progress |
| PUT | `/api/onboarding/answers/:stepId` | Yes | Save one answer |
| GET | `/api/journeys` | Yes | Journey cards with favorite state |
| GET | `/api/journeys/:id` | Yes | Journey details |
| POST | `/api/journeys/:id/favorite` | Yes | Favorite journey |
| DELETE | `/api/journeys/:id/favorite` | Yes | Unfavorite journey |
| GET | `/api/runs/current` | Yes | Latest run for device |
| GET | `/api/runs/:id` | Yes | Owned run details |
| GET | `/api/runs/:id/route` | Yes | Owned run route points |
| GET | `/api/content/placeholder` | No | Normalized external content |

## Frontend Route Summary

| Route | Screen |
| --- | --- |
| `/` | Redirects to `/onboarding/2` |
| `/onboarding/2` through `/onboarding/8` | Onboarding steps |
| `/journey` | Personalized journey |
| `/journey/running` | Running dashboard |
| `/running/activity` | Activity tracking |
| `/running/route` | Expanded route using current run |
| `/running/route/:runId` | Expanded route using route id parameter |

## Response Formats

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Message" } }
```

## Main Validation Rules

- Device-specific routes require `x-device-id`.
- Step IDs must be valid positive integers.
- Journey and run IDs must be valid MongoDB ObjectIds.
- Single-select and yes-no steps require exactly one option.
- Multi-select steps respect stored min and max selection counts.
- Step 6 details are optional, allowed only for `health-yes`, limited to 250 characters, and cleared when `health-no` is saved.
- Runs are queried by both id and device id so another device cannot read them.

## Static Data vs API Data

API-driven values include onboarding steps, saved answers, journeys, placeholder Daily Reports content, current run metrics, and route coordinates.

Presentation-only values include Thomas as the sample user, the avatar, the weight value, habit labels, some dates, and static map images.

## Assumptions and Trade-offs

- Authentication is omitted by design; `x-device-id` represents the sample user.
- The frontend targets a 375 x 812 mobile design.
- Static map assets are used instead of a live map SDK.
- The external content cache is in memory, so it resets when the backend restarts.
- Docker and deployment are documented as optional future work, not implemented behavior.

## Known Limitations

- No real authentication or account management.
- No frontend automated test suite.
- No production deployment files.
- No real GPS/map provider integration.
- External content depends on Bacon Ipsum availability.

## Future Improvements

- Add authentication.
- Add frontend tests.
- Add Docker Compose.
- Add deployment configuration.
- Replace static maps with real route rendering.
- Add richer error states and accessibility testing.

## More Documentation

Start with [docs/README.md](docs/README.md). Troubleshooting is in [docs/deployment/TROUBLESHOOTING.md](docs/deployment/TROUBLESHOOTING.md).

## CodeSandbox Placeholder

A CodeSandbox link can be added here after the project is exported or deployed. The current project is intended to run locally with MongoDB.

## Docker

Docker is planned optional setup. Docker files are not included in the current repository, so Docker commands are not documented as working commands.

## Final Verification Checklist

- [ ] MongoDB is running.
- [ ] Backend `.env` exists.
- [ ] Frontend `.env` exists.
- [ ] `npm install` completed in both folders.
- [ ] `npm run seed` completed.
- [ ] Backend runs on `http://localhost:5000`.
- [ ] Frontend runs on `http://localhost:5173`.
- [ ] Backend build passes.
- [ ] Backend tests pass with `MONGODB_TEST_URI`.
- [ ] Frontend build passes.
