# Fitness Assessment Frontend

React frontend for the fitness assessment project. It implements a mobile-first flow for onboarding, personalized journey, running dashboard, activity tracking, and expanded route viewing.

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- CSS Modules
- Lucide React
- Plus Jakarta Sans

## Folder Structure

```text
public/assets/
  avatars/
  backgrounds/
  banners/
  illustrations/
  journeys/
  maps/
  sports/
src/
  components/common/
  pages/
  styles/
  App.tsx
  main.tsx
```

## Routing Table

| Route | Screen |
| --- | --- |
| `/` | Redirects to `/onboarding/2` |
| `/onboarding/2` | Sports selection |
| `/onboarding/3` | Activity preference pills |
| `/onboarding/4` | Training location |
| `/onboarding/5` | Training frequency |
| `/onboarding/6` | Health problems and optional details |
| `/onboarding/7` | Diet type |
| `/onboarding/8` | Improvement goal carousel |
| `/journey` | Personalized journey dashboard |
| `/journey/running` | Running-selected dashboard |
| `/running/activity` | Running activity tracking |
| `/running/route` | Expanded current route |
| `/running/route/:runId` | Expanded route for a run id |

## Page Flow

Onboarding begins at Step 2 and continues through Step 8. Continue saves the answer through the backend. Skip navigates without saving. Step 8 leads to `/journey`.

From `/journey`, selecting Running opens `/journey/running`. Selecting Running again opens `/running/activity`. Expanding the map opens `/running/route`.

## Reusable Components

Shared components live in `src/components/common/`, including page containers, top navigation, progress bar, question header, selectable cards/pills, and the continue button. Components are reused across onboarding steps where practical.

## Styling

The project uses CSS Modules per component/page and global design tokens in `src/styles/tokens.css`. `globals.css` sets box sizing, font inheritance, body background, and image defaults.

Plus Jakarta Sans is loaded in `index.html` and used globally.

## Environment Variable

Copy `.env.example` to `.env`:

```text
VITE_API_BASE_URL=http://localhost:5000
```

## Setup and Run

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

The current `npm run dev` script builds first and then serves the Vite preview at `http://localhost:5173`.

Build:

```powershell
npm run build
```

## Backend Dependency

The frontend expects the backend to be running at `VITE_API_BASE_URL`. A browser-specific device ID is generated on first use, stored under `fitness-device-id` in `localStorage`, and sent through the `x-device-id` header by the shared API helper.

## Screen-by-Screen API Usage

| Screen | APIs |
| --- | --- |
| `/onboarding/2` | `GET /api/steps/2`, `PUT /api/onboarding/answers/2` |
| `/onboarding/3` | `GET /api/steps/3`, `PUT /api/onboarding/answers/3` |
| `/onboarding/4` | `GET /api/steps/4`, `PUT /api/onboarding/answers/4` |
| `/onboarding/5` | `GET /api/steps/5`, `PUT /api/onboarding/answers/5` |
| `/onboarding/6` | `GET /api/steps/6`, `PUT /api/onboarding/answers/6` |
| `/onboarding/7` | `GET /api/steps/7`, `PUT /api/onboarding/answers/7` |
| `/onboarding/8` | `GET /api/steps/8`, `PUT /api/onboarding/answers/8` |
| `/journey` | `GET /api/journeys`, `GET /api/content/placeholder` |
| `/journey/running` | `GET /api/runs/current` |
| `/running/activity` | `GET /api/runs/current` |
| `/running/route` | `GET /api/runs/current`, `GET /api/runs/:id/route` |
| `/running/route/:runId` | `GET /api/runs/current`, `GET /api/runs/:id/route` |

## Static Presentation Values

The sample name Thomas, avatar, weight, habit labels, some dates, and map images are presentation values. They are not currently stored in the backend.

## Dynamic Values

Onboarding questions/options, journey cards, placeholder Daily Reports text, run metrics, and route points come from the backend.

## Loading and Error Behavior

Pages show compact loading text while fetching. API failures show inline retry messages where needed. Placeholder content failure falls back to static Daily Reports text without breaking `/journey`.

## Responsive Target

The design target is a centered 375 x 812 mobile viewport. Wider screens keep the app centered instead of stretching it.

## Figma Assumptions

The frontend follows the supplied screenshots closely, but does not recreate phone hardware, notch, operating-system status bar, or home indicator as functional UI.

## CodeSandbox Guidance

A CodeSandbox version would need a hosted backend and MongoDB connection. For now, local setup is the supported path.

## Troubleshooting

See `../docs/deployment/TROUBLESHOOTING.md`.
