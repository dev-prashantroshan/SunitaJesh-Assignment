# Fitness Assessment Backend

Backend API for the fitness assessment project. It stores onboarding answers, journeys, favorites, runs, route coordinates, and normalized placeholder content.

## Tech Stack

- Node.js 18+
- Express
- TypeScript
- MongoDB
- Mongoose
- Jest
- Supertest
- dotenv
- cors

## Folder Structure

```text
src/
  config/        Environment and database connection
  constants/     Reusable onboarding constants
  controllers/   Request and response handling
  errors/        ApiError class
  middleware/    Device id and error middleware
  models/        Mongoose schemas
  routes/        Express routers
  seed/          Development seed script
  services/      Business logic and database queries
  utils/         Small helpers such as duration formatting
tests/           Supertest integration tests
postman/         Postman collection
```

## Responsibilities

| Layer | Responsibility |
| --- | --- |
| Routes | Define endpoint paths and attach middleware |
| Controllers | Parse request context and return response envelope |
| Services | Validate, query MongoDB, and prepare response data |
| Models | Define MongoDB document shape and indexes |
| Middleware | Enforce `x-device-id` and centralize errors |

## Environment Variables

Copy `.env.example` to `.env`.

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment-test
NODE_ENV=development
```

`MONGODB_TEST_URI` must be present for tests and must not match `MONGODB_URI`.

## Setup

```powershell
npm install
Copy-Item .env.example .env
```

Start local MongoDB before seeding or running the API.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start development server with reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled server from `dist/server.js` |
| `npm run seed` | Reset and insert development seed data |
| `npm run test` | Run integration tests once |
| `npm run test:watch` | Run tests in watch mode |

## API Endpoints

| Method | Path | Header | Description |
| --- | --- | --- | --- |
| GET | `/api/health` | None | Health check |
| GET | `/api/steps` | None | List Steps 2-8 |
| GET | `/api/steps/:stepId` | None | Get one step |
| GET | `/api/onboarding` | `x-device-id` | Progress and answers |
| PUT | `/api/onboarding/answers/:stepId` | `x-device-id` | Save one answer |
| GET | `/api/journeys` | `x-device-id` | Journey cards |
| GET | `/api/journeys/:id` | `x-device-id` | Journey details |
| POST | `/api/journeys/:id/favorite` | `x-device-id` | Favorite journey |
| DELETE | `/api/journeys/:id/favorite` | `x-device-id` | Unfavorite journey |
| GET | `/api/runs/current` | `x-device-id` | Latest run |
| GET | `/api/runs/:id` | `x-device-id` | Owned run details |
| GET | `/api/runs/:id/route` | `x-device-id` | Owned route coordinates |
| GET | `/api/content/placeholder` | None | Normalized placeholder content |

Sample device id:

```text
device-thomas-001
```

## Sample Requests

Save Step 2:

```http
PUT /api/onboarding/answers/2
x-device-id: device-thomas-001
Content-Type: application/json
```

```json
{ "selectedOptionIds": ["basketball", "football"], "details": "" }
```

Save Step 6 with details:

```json
{ "selectedOptionIds": ["health-yes"], "details": "Minor knee discomfort." }
```

Clear Step 6 details by selecting No:

```json
{ "selectedOptionIds": ["health-no"], "details": "" }
```

## Response Envelope

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Message" } }
```

## Validation and Error Codes

Important codes include:

- `DEVICE_ID_REQUIRED`
- `INVALID_STEP_ID`
- `STEP_NOT_FOUND`
- `INVALID_OPTION`
- `INVALID_SELECTION_COUNT`
- `DETAILS_TOO_LONG`
- `INVALID_JOURNEY_ID`
- `JOURNEY_NOT_FOUND`
- `INVALID_RUN_ID`
- `RUN_NOT_FOUND`
- `EXTERNAL_CONTENT_ERROR`
- `INTERNAL_SERVER_ERROR`

## External Content

`GET /api/content/placeholder` calls Bacon Ipsum with native Node.js `fetch`, normalizes the first paragraph, limits it for UI use, and caches the result for five minutes in memory. Fresh responses return `cached: false`; cache hits return `cached: true`.

If Bacon Ipsum times out, fails, returns non-2xx, or returns an unexpected shape, the API returns HTTP 502 with `EXTERNAL_CONTENT_ERROR`.

## Test Coverage

The backend currently has 8 integration tests covering:

- Steps list
- Valid onboarding answer save
- Invalid onboarding option
- Step 6 details length validation
- Step 6 Yes to No detail clearing
- Idempotent journey favorite
- Run access blocked for another device
- Demo run provisioning for a new browser device

Run with:

```powershell
$env:MONGODB_TEST_URI="mongodb://127.0.0.1:27017/sunita-jesh-assignment-test"
npm run test
```

## Postman

Collection path:

```text
postman/fitness-assessment.postman_collection.json
```

## Assumptions

- Authentication is intentionally omitted.
- Device identity comes from `x-device-id`.
- Steps 4 and 8 are single-select.
- Step 6 details are optional and cleared when No is selected.
- Favorite and unfavorite are idempotent.
- Route coordinates are simplified and embedded in run documents.
- Tests use a dedicated test database.

## Troubleshooting

See `../docs/deployment/TROUBLESHOOTING.md` for common setup and runtime problems.
