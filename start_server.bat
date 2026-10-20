@echo off
setlocal
echo ============================================================
echo    Galeto & Picanha - Servidor Local de Desenvolvimento
echo ============================================================
echo.
echo  Porta: 8089
echo  URL:   http://localhost:8089
echo.
echo  Iniciando servidor local...
echo  Pressione CTRL+C para encerrar.
echo.

where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:8089
    python -m http.server 8089
    goto end
)

where php >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:8089
    php -S localhost:8089
    goto end
)

where npx >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    start http://localhost:8089
    npx serve . -l 8089
    goto end
)

echo [AVISO] Python ou PHP nao encontrados no PATH.
echo Abrindo o arquivo index.html diretamente no navegador...
start index.html

:end
pause
