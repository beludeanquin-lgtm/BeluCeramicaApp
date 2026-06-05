@echo off
setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                                                                ║
echo ║          BE·LU CERÁMICA STUDIO - GENERADOR DE LINK             ║
echo ║                                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Obtener IP local
for /f "tokens=2 delims=:" %%A in ('ipconfig ^| findstr "IPv4 Address"') do (
    set ip=%%A
    set ip=!ip:~1!
)

echo 🌐 LINKS PARA COMPARTIR:
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo 🖥️  LINK LOCAL (en tu computadora):
echo    http://localhost:5000
echo.
echo 📱 LINK PARA COMPARTIR (en la misma red):
echo    http://!ip!:5000
echo.
echo ════════════════════════════════════════════════════════════════
echo.
echo INSTRUCCIONES:
echo.
echo ✓ Comparte este link con tu administradora y alumnas
echo ✓ Solo funciona si tu computadora está encendida
echo ✓ Todos deben estar en la MISMA RED WiFi/Internet
echo.
echo ════════════════════════════════════════════════════════════════
echo.

echo 🚀 Iniciando servidor...
cd /d "%~dp0"
npm start

pause
