@echo off
setlocal

cd /d "%~dp0"

echo ========================================================
echo   CarePulse Patient Management System - Windows Runner
echo ========================================================

if not exist "backend\node_modules\" (
    echo Installing backend dependencies...
    cd backend && call npm install && cd ..
)

if not exist "frontend\node_modules\" (
    echo Installing frontend dependencies...
    cd frontend && call npm install && cd ..
)

start "CarePulse Backend API" cmd /k "cd /d %~dp0backend && npm run start:dev"
start "CarePulse Frontend UI" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Backend running on http://localhost:5000/api
echo Frontend running on http://localhost:3000
