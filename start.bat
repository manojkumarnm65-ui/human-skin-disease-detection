@echo off
title SkinCare AI Launcher
echo ========================================================
echo           Starting SkinCare AI Project
echo ========================================================
echo.

echo [1/2] Starting Flask Backend (http://127.0.0.1:5000)...
start "SkinCare AI - Backend" cmd /k "cd /d "%~dp0backend" && venv\Scripts\python.exe app.py"

echo Waiting for backend to initialize...
timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Vite Dev Server (http://localhost:5173)...
start "SkinCare AI - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ========================================================
echo Project started successfully!
echo.
echo Frontend URL: http://localhost:5173
echo Backend API:  http://127.0.0.1:5000
echo.
echo Demo Credentials:
echo   - User:  demo@skincare.ai  / Password123!
echo   - Admin: admin@skincare.ai / AdminSecure2026!
echo ========================================================
echo Press any key to exit this launcher window (servers keep running).
pause >nul

