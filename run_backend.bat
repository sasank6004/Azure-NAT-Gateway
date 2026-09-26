@echo off
echo ========================================================
echo Starting Azure NAT Gateway FastAPI Backend Server...
echo ========================================================
cd /d "%~dp0"
python backend/run.py
pause
