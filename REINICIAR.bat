@echo off
echo Matando procesos node anteriores...
FOR /F "tokens=5 delims= " %%P IN ('netstat -ano ^| findstr ":5000"') DO taskkill /PID %%P /F 2>nul

echo Esperando...
timeout /t 2 /nobreak

echo Iniciando servidor...
npm start

pause
