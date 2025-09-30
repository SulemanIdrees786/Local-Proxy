@echo off
title Local Proxy Server
color 0A

echo ==========================================
echo    Windows Local Proxy Server Starter
echo ==========================================
echo.

:: Set the directory where proxy.js is located
set PROXY_DIR=D:\hehehe\my-local-proxy

:: Change to the proxy directory
cd /d "%PROXY_DIR%"

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

:: Check if proxy.js exists in the current directory (which we changed to PROXY_DIR)
if not exist "proxy.js" (
    echo ERROR: proxy.js file not found in %PROXY_DIR%!
    echo Please check the path in the batch file.
    pause
    exit /b 1
)

:: Display Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo Using Node.js version: %NODE_VERSION%
echo.

:: Check if port 8080 is available
netstat -an | findstr ":8080" >nul
if not errorlevel 1 (
    echo WARNING: Port 8080 appears to be in use!
    echo Another application might be using this port.
    echo.
)

echo Starting Proxy Server...
echo Server will run on: http://127.0.0.1:8080
echo.
echo Configure your browser/system to use:
echo    Proxy: 127.0.0.1
echo    Port:  8080
echo.
echo Press Ctrl+C to stop the server
echo ==========================================
echo.

:: Run the proxy server
node proxy.js

:: If the script reaches here, the server stopped
echo.
echo Proxy server has stopped.
pause