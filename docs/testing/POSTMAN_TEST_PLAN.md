# Postman Test Plan

Use this guide to manually test the backend API with Postman.

## Preparation

1. Start MongoDB.
2. Install backend dependencies:

```powershell
cd backend
npm install
```

3. Create backend `.env`:

```powershell
Copy-Item .env.example .env
```

4. Seed data:

```powershell
npm run seed
```

5. Start backend:

```powershell
npm run dev
```

6. Import collection:

```text
backend/postman/fitness-assessment.postman_collection.json
```

## Collection Variables

| Variable | Value |
| --- | --- |
| `baseUrl` | `http://localhost:5000` |
| `deviceId` | `device-thomas-001` |
| `journeyId` | Copy from `GET /api/journeys` |
| `runId` | Copy from `GET /api/runs/current` |

## Endpoint Tests

### GET /api/health

- Purpose: confirm server is running.
- URL: `{{baseUrl}}/api/health`
- Headers: none.
- Body: none.
- Expected status: 200.
- Expected fields: `success`, `data.status`.
- Positive: response status is `ok`.
- Negative: stop backend and confirm request fails.

### GET /api/steps

- Purpose: list onboarding Steps 2-8.
- URL: `{{baseUrl}}/api/steps`
- Expected status: 200.
- Expected fields: `data.steps` with 7 items.
- Positive: options and selection limits are present.
- Negative: none important for this read endpoint.

### GET /api/steps/:stepId

- Purpose: fetch one step.
- URL: `{{baseUrl}}/api/steps/2`
- Expected status: 200.
- Positive: `data.step.stepId` is 2.
- Negative: use `/api/steps/not-a-number`; expect invalid step error.

### GET /api/onboarding

- Purpose: get saved answers and progress.
- URL: `{{baseUrl}}/api/onboarding`
- Headers: `x-device-id: {{deviceId}}`
- Expected status: 200.
- Negative: remove header; expect 400 `DEVICE_ID_REQUIRED`.

### PUT /api/onboarding/answers/:stepId

- Purpose: save or update an answer.
- URL: `{{baseUrl}}/api/onboarding/answers/2`
- Headers: `x-device-id`, `Content-Type: application/json`
- Body:

```json
{ "selectedOptionIds": ["basketball", "football"], "details": "" }
```

- Expected status: 200.
- Positive: saved answer and progress returned.
- Negative: invalid option id returns 400 `INVALID_OPTION`.
- Negative: invalid selection count returns 400 `INVALID_SELECTION_COUNT`.
- Special: Step 6 details longer than 250 characters returns `DETAILS_TOO_LONG`.
- Special: save Step 6 with `health-yes` and details, then save `health-no` with empty details; previous details should clear.

### GET /api/journeys

- Purpose: list journey cards with favorite state.
- URL: `{{baseUrl}}/api/journeys`
- Headers: `x-device-id`.
- Expected status: 200.
- Positive: copy one `id` into `journeyId`.
- Negative: missing header returns `DEVICE_ID_REQUIRED`.

### GET /api/journeys/:id

- Purpose: journey details.
- URL: `{{baseUrl}}/api/journeys/{{journeyId}}`
- Headers: `x-device-id`.
- Expected status: 200.
- Negative: invalid id returns 400 `INVALID_JOURNEY_ID`.
- Negative: valid but missing id returns 404 `JOURNEY_NOT_FOUND`.

### POST /api/journeys/:id/favorite

- Purpose: favorite a journey.
- URL: `{{baseUrl}}/api/journeys/{{journeyId}}/favorite`
- Headers: `x-device-id`.
- Expected status: 200.
- Positive: `isFavorite` is true.
- Special: repeat the same request; still 200 and no duplicate should be created.

### DELETE /api/journeys/:id/favorite

- Purpose: unfavorite a journey.
- URL: `{{baseUrl}}/api/journeys/{{journeyId}}/favorite`
- Headers: `x-device-id`.
- Expected status: 200.
- Positive: `isFavorite` is false.
- Special: repeat request; still 200.

### GET /api/runs/current

- Purpose: latest run for current device.
- URL: `{{baseUrl}}/api/runs/current`
- Headers: `x-device-id`.
- Expected status: 200.
- Positive: copy `data.run.id` into `runId`.
- Negative: missing header returns `DEVICE_ID_REQUIRED`.

### GET /api/runs/:id

- Purpose: owned run detail without route coordinates.
- URL: `{{baseUrl}}/api/runs/{{runId}}`
- Headers: `x-device-id`.
- Expected status: 200.
- Negative: invalid id returns `INVALID_RUN_ID`.
- Negative: use another device id; expect 404 `RUN_NOT_FOUND`.

### GET /api/runs/:id/route

- Purpose: route coordinates sorted by order.
- URL: `{{baseUrl}}/api/runs/{{runId}}/route`
- Headers: `x-device-id`.
- Expected status: 200.
- Positive: `data.route` array is present.
- Negative: wrong device returns `RUN_NOT_FOUND`.

### GET /api/content/placeholder

- Purpose: normalized external content.
- URL: `{{baseUrl}}/api/content/placeholder`
- Headers: none.
- Expected status: 200 when Bacon Ipsum is reachable, or 502 if external service fails.
- Positive: first successful call has `cached: false`; immediate second call has `cached: true`.
- Negative: external failure is best tested through automated mocking or temporary local configuration, not ordinary Postman alone.

## Common Negative Tests

- Remove `x-device-id` from protected routes.
- Use invalid ObjectIds for journeys and runs.
- Use invalid onboarding option ids.
- Send too many selections for single-select steps.
- Send missing, empty, and whitespace-only details with Step 6 `health-yes`.
- Send multiple valid option ids for Step 8 and verify all are stored.
- Send Step 6 details over 250 characters.
