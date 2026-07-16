$ErrorActionPreference = "Stop"

function Write-ProgressMessage {
    param([string]$Message)
    Write-Host "`n[>] $Message" -ForegroundColor Cyan
}

function Write-Failure {
    param([string]$Message)
    Write-Host "`n----------------------------------------" -ForegroundColor Red
    Write-Host $Message -ForegroundColor Red
    Write-Host "----------------------------------------" -ForegroundColor Red
}

Set-Location -LiteralPath $PSScriptRoot

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    Write-Host "Docker Desktop is not installed." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please install Docker Desktop:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "https://www.docker.com/products/docker-desktop/" -ForegroundColor Cyan
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker detected." -ForegroundColor Green

& docker info *> $null
if ($LASTEXITCODE -ne 0) {
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    Write-Host "Docker Desktop is not running." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please start Docker Desktop and run this script again." -ForegroundColor Yellow
    Write-Host "----------------------------------------" -ForegroundColor Yellow
    exit 1
}

Write-Host "[OK] Docker Desktop is running." -ForegroundColor Green
Write-ProgressMessage "Building and starting the application..."

& docker compose up --build -d
if ($LASTEXITCODE -ne 0) {
    Write-Failure "Docker Compose could not start the application. Review the output above and try again."
    exit 1
}

Write-Host "[OK] Docker Compose started." -ForegroundColor Green
Write-ProgressMessage "Waiting for the backend to become healthy..."

$healthUrl = "http://localhost:5000/api/health"
$backendHealthy = $false
$healthTimer = [System.Diagnostics.Stopwatch]::StartNew()

while ($healthTimer.Elapsed.TotalSeconds -lt 60) {
    try {
        $health = Invoke-RestMethod -Uri $healthUrl -Method Get -TimeoutSec 5
        if ($health.success -eq $true -and $health.data.status -eq "ok") {
            $backendHealthy = $true
            break
        }
    }
    catch {
        # The backend may still be connecting to MongoDB. Retry quietly.
    }

    Start-Sleep -Seconds 2
}

if (-not $backendHealthy) {
    Write-Failure "The backend did not become healthy within 60 seconds. Run 'docker compose logs backend' for details."
    exit 1
}

Write-Host "[OK] Backend is healthy." -ForegroundColor Green
Write-ProgressMessage "Seeding MongoDB..."

& docker compose exec backend npm run seed
if ($LASTEXITCODE -ne 0) {
    Write-Failure "MongoDB seeding failed. Review the output above and try again."
    exit 1
}

Write-Host "[OK] MongoDB seeded." -ForegroundColor Green
Write-ProgressMessage "Opening the frontend in your default browser..."

try {
    Start-Process "http://localhost:5173"
}
catch {
    Write-Failure "The application started, but the browser could not be opened automatically. Open http://localhost:5173 manually."
    exit 1
}

Write-Host "[OK] Browser opened." -ForegroundColor Green
Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Application started successfully." -ForegroundColor Green
Write-Host ""
Write-Host "Frontend"
Write-Host "http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend Health"
Write-Host "http://localhost:5000/api/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "To stop:"
Write-Host ""
Write-Host "docker compose down" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Green
