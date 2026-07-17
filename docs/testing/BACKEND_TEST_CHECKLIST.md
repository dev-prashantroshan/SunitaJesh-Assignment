# Backend Test Checklist

## Environment

- [ ] MongoDB is running.
- [ ] `backend/.env` exists.
- [ ] `PORT` is set or defaults to 5000.
- [ ] `MONGODB_URI` points to a development database.
- [ ] `MONGODB_TEST_URI` points to a separate test database.
- [ ] `MONGODB_TEST_URI` does not match `MONGODB_URI`.

## Startup and Seed

- [ ] `npm install` completes.
- [ ] `npm run build` passes.
- [ ] `npm run seed` completes.
- [ ] Seed creates Steps 2-8.
- [ ] Seed creates journeys.
- [ ] Seed creates runs for `device-thomas-001`.

## Core API

- [ ] `GET /api/health` returns success.
- [ ] `GET /api/steps` returns 7 steps.
- [ ] `GET /api/steps/:stepId` returns complete step definitions.
- [ ] Protected routes reject missing `x-device-id`.
- [ ] Error responses use the standard envelope.

## Onboarding

- [ ] Valid answer upserts successfully.
- [ ] Progress updates after answers.
- [ ] Invalid option returns `INVALID_OPTION`.
- [ ] Invalid selection count returns `INVALID_SELECTION_COUNT`.
- [ ] Step 6 details over 250 characters returns `DETAILS_TOO_LONG`.
- [ ] Step 6 `health-yes` stores optional details.
- [ ] Step 6 `health-no` clears previous details.

## Journeys

- [ ] Journey list returns `isFavorite`.
- [ ] Journey detail validates ObjectId.
- [ ] Favorite endpoint is idempotent.
- [ ] Unfavorite endpoint is idempotent.
- [ ] Duplicate favorite records are not created.

## Runs

- [ ] Current run returns latest run by `startedAt` descending.
- [ ] Run detail excludes route coordinates.
- [ ] Route endpoint returns route points.
- [ ] Wrong device cannot access another device run.

## External Content

- [ ] Placeholder endpoint returns normalized content when external API works.
- [ ] Second call within five minutes returns cached content.
- [ ] External failure returns `EXTERNAL_CONTENT_ERROR`.

## Automated Tests

- [ ] Run `npm run test` with `MONGODB_TEST_URI`.
- [ ] 8 integration tests pass.
- [ ] Tests use real Express app.
- [ ] Tests use dedicated test database.

## Postman

- [ ] Collection file exists at `backend/postman/fitness-assessment.postman_collection.json`.
- [ ] Collection variables are set.
- [ ] Device header is present on protected requests.
