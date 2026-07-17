# Demo Script

Use this as a speaking guide for the project presentation.

## 1. 30-Second Introduction

- Show: root README and running app.
- Say: "This is a full-stack fitness assessment app with a TypeScript Express backend, MongoDB data, and a React mobile frontend. It covers onboarding, personalized journeys, running metrics, and route viewing."
- Duration: 30 seconds.
- Possible question: "Is this production ready?" Answer: "It is assessment-ready, with known production gaps documented."

## 2. Problem Statement

- Show: onboarding Step 2.
- Say: "The user answers fitness questions, receives journey content, and can inspect running activity."
- Duration: 30 seconds.
- Question: "Why start at Step 2?" Answer: "The assignment scope provided Steps 2-8."

## 3. What Was Implemented

- Show: flow from onboarding to route.
- Say: "Implemented backend APIs, database seed, Postman collection, tests, and frontend screens using live API data."
- Duration: 45 seconds.
- Question: "What is not implemented?" Answer: "Authentication, Docker, deployment, and frontend automated tests."

## 4. Technology Stack

- Show: README tech stack table.
- Say: "The stack is intentionally familiar for MERN developers: Node, Express, TypeScript, MongoDB, Mongoose, React, Vite, Router, CSS Modules."
- Duration: 45 seconds.
- Question: "Why not Redux?" Answer: "State is local and simple."

## 5. Architecture Overview

- Show: docs/demo/ARCHITECTURE.md.
- Say: "Requests flow from React to Express routes, controllers, services, Mongoose, and MongoDB."
- Duration: 1 minute.
- Question: "Where is validation?" Answer: "In service logic before persistence."

## 6. Backend Walkthrough

- Show: `backend/src` folders.
- Say: "Routes define URLs, controllers format responses, services hold logic, models define MongoDB data."
- Duration: 2 minutes.
- Question: "How are errors handled?" Answer: "ApiError and centralized middleware return a standard envelope."

## 7. Frontend Walkthrough

- Show: `frontend/src/pages` and `components/common`.
- Say: "Each screen is a page. Shared onboarding UI is in common components. Styling uses CSS Modules and tokens."
- Duration: 2 minutes.
- Question: "Is data mocked?" Answer: "Screen content is mostly API-driven; presentation-only items are documented."

## 8. Full Application Demo Order

1. Open `/onboarding/2`.
2. Select and deselect a sport.
3. Use Continue and Skip.
4. Complete through Step 8.
5. Show `/journey`.
6. Open Running.
7. Open Activity Tracking.
8. Expand route.

Duration: 5-7 minutes.

## 9. Onboarding Talking Points

- Show: Steps 2-8.
- Say: "Steps are fetched from `/api/steps/:stepId`; answers are saved with `PUT /api/onboarding/answers/:stepId`."
- Duration: 2 minutes.
- Question: "How does Step 6 work?" Answer: "Details are optional for Yes, limited to 250 characters, and cleared when No is selected."

## 10. Journey Screen Talking Points

- Show: `/journey`.
- Say: "Journey cards come from `/api/journeys`, and Daily Reports uses `/api/content/placeholder` with fallback."
- Duration: 1 minute.
- Question: "What if external content fails?" Answer: "The backend returns a controlled error and the frontend uses fallback text."

## 11. Running Screen Talking Points

- Show: `/journey/running`, `/running/activity`, `/running/route`.
- Say: "Run metrics come from `/api/runs/current`; route points come from `/api/runs/:id/route`."
- Duration: 2 minutes.
- Question: "Is this a real map?" Answer: "No, it uses static map assets for the assessment."

## 12. API and Database Demonstration

- Show: seed script and MongoDB data if available.
- Say: "Seed creates steps, journeys, and two runs for `device-thomas-001`."
- Duration: 1 minute.
- Question: "Can another device access the run?" Answer: "No, run queries include device id."

## 13. Postman Demonstration

- Show: collection import and variables.
- Say: "Set `baseUrl`, `deviceId`, `journeyId`, and `runId`, then run endpoint checks."
- Duration: 2 minutes.
- Question: "How do I get ids?" Answer: "Use journey list and current run endpoints."

## 14. Automated Tests Demonstration

- Show: `npm run test`.
- Say: "There are 8 integration tests with a dedicated test database."
- Duration: 1 minute.
- Question: "Why these 8?" Answer: "They cover core behavior and the new-device running regression without over-testing every field."

## 15. Error Handling Example

- Show: invalid option or missing device header.
- Say: "Errors use `{ success: false, error: { code, message } }`."
- Duration: 1 minute.
- Question: "Are raw errors exposed?" Answer: "No."

## 16. Design Decisions

- Show: PROJECT_DECISIONS.md.
- Say: "Choices prioritize clarity and assessment scope over production complexity."
- Duration: 1 minute.

## 17. Assumptions

- No authentication.
- `x-device-id` represents user identity.
- Mobile target is 375 x 812.
- Static map assets are acceptable.

Duration: 45 seconds.

## 18. Known Limitations

- No deployment config.
- No Docker files.
- No frontend test automation.
- No real map SDK.

Duration: 45 seconds.

## 19. Future Improvements

- Authentication.
- Docker Compose.
- Frontend tests.
- Real map/GPS.
- Production deployment.

Duration: 45 seconds.

## 20. Closing Summary

- Say: "The project demonstrates backend structure, validation, tests, API integration, and a mobile frontend matching the requested flow."
- Duration: 30 seconds.
