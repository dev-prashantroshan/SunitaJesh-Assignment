# Changelog

## 1.0.0

- Added backend foundation with Node.js, Express, TypeScript, Mongoose, dotenv, CORS, JSON parsing, and centralized error handling.
- Added MongoDB models for Steps, Onboarding Answers, Journeys, Journey Favorites, and Runs.
- Added seed data for onboarding Steps 2-8, journeys, and sample runs for `device-thomas-001`.
- Added onboarding APIs for step retrieval, answer saving, and progress tracking.
- Added journey APIs for list, detail, favorite, and unfavorite.
- Added run APIs for current run, run detail, and route coordinates.
- Added normalized placeholder content API backed by Bacon Ipsum.
- Added five-minute in-memory cache for placeholder content.
- Added backend integration tests with Jest and Supertest.
- Added Postman collection covering all backend endpoints.
- Added frontend foundation with React, TypeScript, Vite, React Router, CSS Modules, and Lucide React.
- Added onboarding screens for Steps 2-8.
- Added personalized journey screen.
- Added running dashboard, activity tracking, and expanded route screens.
- Added frontend API integration for onboarding, journeys, placeholder content, current run, and route data.
- Added back navigation, skip navigation, option deselection, and continue-button state handling.
- Fixed Step 6 backend detail clearing when changing from `health-yes` to `health-no`.
- Added full documentation package for setup, testing, architecture, demo, troubleshooting, and decisions.
