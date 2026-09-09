# NGO Verify & Connect - Single Command Launcher
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "  🛡️  NGO VERIFY & CONNECT PLATFORM RUNNER        " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine")

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

# 1. Run seed check / import if needed
Write-Host "`n📦 Verifying database records..." -ForegroundColor Yellow
node backend/src/import-seed.js

# 2. Launch the full-stack server
Write-Host "`n🚀 Launching Full-Stack Application on http://localhost:5000..." -ForegroundColor Green
Write-Host "   Frontend & Backend accessible at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   (Press Ctrl+C to stop)`n" -ForegroundColor DarkGray

Start-Process "http://localhost:5000"
node backend/src/server.js
