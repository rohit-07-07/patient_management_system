Set-Location $PSScriptRoot

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  CarePulse Patient Management System - Windows Runner" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

if (-not (Test-Path "backend\node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Push-Location backend
    npm install
    Pop-Location
}

if (-not (Test-Path "frontend\node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Push-Location frontend
    npm install
    Pop-Location
}

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; npm run start:dev"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm run dev"

Write-Host "Backend API launched: http://localhost:5000/api" -ForegroundColor Green
Write-Host "Frontend UI launched: http://localhost:3000" -ForegroundColor Green
