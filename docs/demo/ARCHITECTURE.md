# Architecture

## 1. System Architecture

```text
Browser
  -> React frontend
  -> Express API
  -> Route
  -> Controller
  -> Service
  -> Mongoose model
  -> MongoDB
```

The frontend renders screens and calls the backend. Express routes receive requests. Controllers return the standard response envelope. Services validate and query data. Mongoose talks to MongoDB.

## 2. Onboarding Request Flow

```text
/onboarding/6 screen
  -> GET /api/steps/6
  -> user selects option
  -> PUT /api/onboarding/answers/6
  -> validate option count and details
  -> upsert OnboardingAnswer
  -> return answer and progress
```

Step 6 uses `health-yes` and `health-no`. Details are optional for Yes and cleared for No.

## 3. Journey Request Flow

```text
/journey screen
  -> GET /api/journeys with x-device-id
  -> Journey service fetches journeys
  -> JourneyFavorite is queried once for device
  -> response includes isFavorite
```

The list response avoids activities and benefits to keep cards lightweight.

## 4. Running Request Flow

```text
/running/activity
  -> GET /api/runs/current with x-device-id
  -> latest run sorted by startedAt desc
  -> UI shows distance, duration, calories, heart rate, steps
```

Expanded route also calls `/api/runs/:id/route` and draws the returned points.

## 5. External Placeholder Content Flow

```text
/journey
  -> GET /api/content/placeholder
  -> backend checks in-memory cache
  -> if missing, calls Bacon Ipsum
  -> normalizes first paragraph
  -> returns Daily Fitness Insight
```

If Bacon Ipsum fails, backend returns a 502 envelope. The frontend falls back to static text.

## 6. Frontend Navigation Flow

```text
/ -> /onboarding/2
/onboarding/2 -> ... -> /onboarding/8
/onboarding/8 -> /journey
/journey -> /journey/running
/journey/running -> /running/activity
/running/activity -> /running/route
```

Back and Skip are handled with React Router, not full page reloads.

## 7. Data Ownership

| Data | Owner |
| --- | --- |
| Steps | Backend seed and MongoDB |
| Answers | Backend and MongoDB by device id |
| Journeys | Backend seed and MongoDB |
| Favorites | Backend and MongoDB by device id |
| Runs | Backend seed and MongoDB by device id |
| Static avatar/map | Frontend public assets |

## 8. API Response Envelope

```text
Success: { success: true, data: ... }
Error:   { success: false, error: { code, message } }
```

The frontend depends on these shapes when checking responses.

## 9. Error Flow

```text
Service detects problem
  -> throws ApiError(status, message, code)
  -> controller passes to next(error)
  -> error middleware sends envelope
```

Unexpected errors become `INTERNAL_SERVER_ERROR`.

## 10. Test Architecture

```text
Jest + Supertest
  -> real Express app
  -> dedicated MongoDB test database
  -> seed minimal documents per test
  -> assert status and response body
```

Tests never intentionally use the development database.
