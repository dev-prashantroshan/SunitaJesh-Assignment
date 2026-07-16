# Troubleshooting

Each item uses diagnosis -> cause -> fix.

## npm command blocked by PowerShell

Diagnosis: PowerShell refuses to run npm scripts.

Cause: Execution policy or shell restriction.

Fix:

```powershell
npm.cmd install
npm.cmd run build
```

## npm install timeout

Diagnosis: install hangs or fails.

Cause: network or npm registry issue.

Fix:

```powershell
npm cache verify
npm install
```

If needed, delete `node_modules` and reinstall.

## MongoDB ECONNREFUSED 127.0.0.1:27017

Diagnosis: backend cannot connect to MongoDB.

Cause: MongoDB is not running or URI is wrong.

Fix: start MongoDB service or update `MONGODB_URI`.

## MongoDB service not running

Diagnosis: `mongod` is installed but API cannot connect.

Cause: Windows service is stopped.

Fix: open Services, start MongoDB Server, then retry.

## Seed fails

Diagnosis: `npm run seed` prints an error.

Cause: MongoDB not running or invalid connection string.

Fix: verify `backend/.env`, start MongoDB, rerun seed.

## Test URI missing

Diagnosis: tests fail with `MONGODB_TEST_URI is required for tests`.

Cause: environment variable is not set.

Fix:

```powershell
$env:MONGODB_TEST_URI="mongodb://127.0.0.1:27017/sunita-jesh-assignment-test"
npm run test
```

## Backend port 5000 already in use

Diagnosis: backend cannot start.

Cause: another process uses port 5000.

Fix: stop the old backend terminal or change `PORT` in `.env`.

## Frontend port 5173 already in use

Diagnosis: Vite preview says port is in use.

Cause: another frontend server is already running.

Fix: close the old terminal or stop the process using port 5173.

## Frontend blank screen

Diagnosis: browser shows empty page.

Cause: JavaScript error, wrong URL, or stale Vite cache.

Fix: open DevTools console, confirm `http://localhost:5173`, restart frontend, and run `npm run build`.

## React/Vite JSX runtime issue

Diagnosis: browser console mentions JSX runtime export errors.

Cause: dependency or Vite cache mismatch.

Fix:

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
npm run build
```

## Vite cache issue

Diagnosis: old frontend code appears.

Cause: browser or Vite cache.

Fix: hard refresh browser, restart frontend, or clear browser cache.

## Wrong VITE_API_BASE_URL

Diagnosis: frontend API calls fail.

Cause: frontend `.env` points to wrong backend URL.

Fix: set:

```text
VITE_API_BASE_URL=http://localhost:5000
```

Restart frontend after changing `.env`.

## CORS issue

Diagnosis: browser blocks API request.

Cause: backend not running or wrong backend origin.

Fix: start backend and confirm `GET /api/health` works.

## Images not loading

Diagnosis: broken images in frontend.

Cause: missing file in `frontend/public/assets` or wrong path.

Fix: confirm requested path exists under `public/assets`.

## Browser showing stale changes

Diagnosis: old UI after code edits.

Cause: cache or old dev server.

Fix: restart frontend and hard refresh browser.

## Duplicate Vite config

Diagnosis: Vite behaves unexpectedly.

Cause: multiple configs or stale generated files.

Fix: use `frontend/vite.config.mjs` and avoid adding another config unless needed.

## Postman missing device header

Diagnosis: protected route returns `DEVICE_ID_REQUIRED`.

Cause: missing `x-device-id`.

Fix: add header:

```text
x-device-id: device-thomas-001
```

## Bacon Ipsum failure

Diagnosis: `/api/content/placeholder` returns 502.

Cause: external service, timeout, or network issue.

Fix: retry later. The frontend falls back to static Daily Reports text.

## Docker daemon not running

Diagnosis: Docker commands fail.

Cause: Docker Desktop is closed.

Fix: open Docker Desktop. Docker setup is not currently implemented for this repository.

## Build failure

Diagnosis: `npm run build` fails.

Cause: TypeScript error or missing dependency.

Fix: read the first error, run `npm install`, then rebuild.

## Clear node_modules and reinstall

Use this only when dependencies are corrupted.

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```
