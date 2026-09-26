# Launch Azure NAT Gateway FastAPI backend server
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $scriptPath
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Starting Azure NAT Gateway FastAPI Backend Server..." -ForegroundColor Cyan
Write-Host "API Endpoint: http://localhost:8000" -ForegroundColor Green
Write-Host "Docs: http://localhost:8000/docs" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
python backend/run.py
