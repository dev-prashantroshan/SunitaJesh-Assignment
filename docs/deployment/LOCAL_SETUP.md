# Local Setup Guide

This guide is written for someone setting up the project on Windows with PowerShell.

## 1. Install Node.js

Download Node.js 18 or newer from the official Node.js website. The installer includes npm.

Verify:

```powershell
node --version
npm --version
```

## 2. Install Git

Install Git for Windows.

Verify:

```powershell
git --version
```

## 3. Install MongoDB

Install MongoDB Community Server, or prepare a MongoDB Atlas connection string.

Verify local MongoDB:

```powershell
mongod --version
```

## 4. Download or Clone the Project

If using Git:

```powershell
git clone <repository-url>
cd <repository-folder>
```

If downloaded as a ZIP, extract it and open PowerShell in the extracted folder.

## 5. Create Backend Environment File

```powershell
cd backend
Copy-Item .env.example .env
```

Open `backend/.env` and confirm:

```text
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment
MONGODB_TEST_URI=mongodb://127.0.0.1:27017/sunita-jesh-assignment-test
NODE_ENV=development
```

## 6. Create Frontend Environment File

```powershell
cd ..\frontend
Copy-Item .env.example .env
```

Open `frontend/.env` and confirm:

```text
VITE_API_BASE_URL=http://localhost:5000
```

## 7. Install Backend Dependencies

Open Terminal 1:

```powershell
cd backend
npm install
```

## 8. Install Frontend Dependencies

Open Terminal 2:

```powershell
cd frontend
npm install
```

## 9. Start MongoDB

If MongoDB is installed as a Windows service, it may already be running.

If you need to start it manually, use the MongoDB service app or run MongoDB according to your installation path.

## 10. Seed the Database

In Terminal 1, from `backend/`:

```powershell
npm run seed
```

Expected success message:

```text
Seed completed
```

## 11. Start Backend

In Terminal 1, keep this running:

```powershell
npm run dev
```

Expected success message:

```text
MongoDB connected
Server running on port 5000
```

## 12. Start Frontend

In Terminal 2, keep this running:

```powershell
npm run dev
```

Expected URL:

```text
http://localhost:5173
```

Two terminals are required because the backend and frontend are separate applications that both need to keep running.

## 13. Open Browser

Open:

```text
http://localhost:5173
```

The app redirects to onboarding Step 2.

## 14. Verify Backend Health

Open in the browser or Postman:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{ "success": true, "data": { "status": "ok" } }
```

## 15. Stop Applications

In each terminal, press:

```text
Ctrl + C
```

Then confirm if PowerShell asks to terminate the batch job.
