# Frontend Test Checklist

Use this checklist in a browser at `http://localhost:5173` after backend and MongoDB are running.

## Startup

- [ ] Frontend starts with `npm run dev`.
- [ ] Backend is running at `http://localhost:5000`.
- [ ] Browser console has no React runtime errors.
- [ ] Browser network tab has no CORS errors.
- [ ] Images and local assets load.
- [ ] App remains centered at mobile width.

## Onboarding

- [ ] `/onboarding/2` loads from API.
- [ ] `/onboarding/3` loads from API.
- [ ] `/onboarding/4` loads from API.
- [ ] `/onboarding/5` loads from API.
- [ ] `/onboarding/6` loads from API.
- [ ] `/onboarding/7` loads from API.
- [ ] `/onboarding/8` loads from API.
- [ ] Options can be selected.
- [ ] Selected options can be deselected.
- [ ] Continue is disabled with no selection.
- [ ] Continue enables after valid selection.
- [ ] Continue saves answers.
- [ ] Back works on Steps 2-8.
- [ ] Skip works on Steps 2-8 without saving.
- [ ] Step 6 shows details only for `health-yes`.
- [ ] Step 6 clears details when `health-yes` is deselected or `health-no` is selected.
- [ ] Step 8 carousel/card selection works as single-select.
- [ ] Step 8 Continue navigates to `/journey`.

## Journey

- [ ] `/journey` loads `GET /api/journeys`.
- [ ] `/journey` attempts `GET /api/content/placeholder`.
- [ ] Daily Reports shows placeholder description or fallback.
- [ ] Running card navigates to `/journey/running`.

## Running Dashboard

- [ ] `/journey/running` loads `GET /api/runs/current`.
- [ ] Backend steps value appears.
- [ ] Backend heart-rate value appears.
- [ ] Running card navigates to `/running/activity`.

## Activity Tracking

- [ ] `/running/activity` loads current run data.
- [ ] Map image loads.
- [ ] Map pin image loads.
- [ ] Distance, duration, calories, heart rate, and steps appear.
- [ ] Expand button navigates to `/running/route`.

## Expanded Route

- [ ] `/running/route` uses actual current run id.
- [ ] `/running/route/:runId` uses route id parameter.
- [ ] `GET /api/runs/:id/route` succeeds.
- [ ] Route line renders.
- [ ] Back returns to `/running/activity`.
- [ ] Pause button toggles local UI state.

## Regression Checks

- [ ] No active route renders a placeholder page.
- [ ] No hardcoded run id is used.
- [ ] Protected API calls include `x-device-id`.
- [ ] `npm run build` passes.
