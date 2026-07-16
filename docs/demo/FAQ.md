# FAQ

## Why MongoDB instead of SQL?

The data is document-friendly: steps with options, journeys, runs, and embedded route points. SQL could also work, but MongoDB keeps the assessment simple.

## Why Mongoose?

It provides schemas, indexes, validation helpers, and familiar MERN patterns.

## Why TypeScript?

It makes request, response, and model shapes easier to maintain.

## Why Express?

Express is simple, readable, and appropriate for a small API assessment.

## Why React?

The UI is component-based and matches the MERN expectation.

## Why Vite?

It gives a fast TypeScript React setup with minimal configuration.

## Why CSS Modules?

They keep styles scoped without adding a UI framework.

## Why not Redux?

The app uses local page state and direct API calls. Global state would be unnecessary right now.

## Why no authentication?

Authentication was out of scope. The sample device header stands in for identity.

## How is a user identified?

Device-specific API calls use `x-device-id`, with sample value `device-thomas-001`.

## How is validation handled?

Backend services validate step ids, option ids, selection counts, ObjectIds, and Step 6 detail length.

## How are errors handled?

Services throw `ApiError`; centralized middleware returns a standard error envelope.

## How is duplicate favorite prevented?

`JourneyFavorite` has a unique device/journey model pattern and the service uses safe upsert behavior.

## Why are favorite endpoints idempotent?

Repeated mobile requests should be safe. Favoriting twice still returns success.

## How is onboarding progress calculated?

The backend counts saved answers for Steps 2-8 and returns completed steps, total steps, percentage, next step, and completion state.

## How is Step 6 handled?

`health-yes` allows optional details up to 250 characters. `health-no` clears previous details.

## How does caching work?

Placeholder content is cached in backend memory for five minutes.

## What happens if Bacon Ipsum fails?

The backend returns `EXTERNAL_CONTENT_ERROR`. The frontend uses fallback Daily Reports text.

## How are routes secured per device?

Run queries include both `_id` and `deviceId`, so another device receives `RUN_NOT_FOUND`.

## Why static maps?

The assignment focused on API integration and visual matching, not live GPS or map SDK setup.

## How would you add real GPS?

Add route collection/storage, device location ingestion, and a map SDK such as Mapbox or Google Maps.

## How would you scale the backend?

Add authentication, request validation schemas, indexes, logging, monitoring, Redis cache, and deployment configuration.

## How would you add Redis?

Replace the in-memory placeholder cache with Redis keys and TTLs.

## How would you deploy this?

Deploy backend to a Node host, MongoDB to Atlas, frontend to a static host, and set environment variables.

## How would you add authentication?

Use a login provider or JWT flow, replace `x-device-id` with authenticated user identity, and protect routes.

## How would you improve testing?

Add frontend tests, API contract tests, Postman assertions, and CI checks.

## What was the hardest part?

Keeping visual fidelity while maintaining real API integration and simple code structure.

## What would you improve with more time?

Docker, deployment, frontend automated tests, accessibility testing, and a real map integration.
