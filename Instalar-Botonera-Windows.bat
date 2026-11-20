@echo off
chcp 65001 >nul
echo ========================================================
echo        INSTALADOR DE BOTONERA PARA WINDOWS
echo ========================================================
echo.
echo Creando accesos directos con el logo de Rear Window...
echo.

set TARGET_EXE=E:\Apps\Botonera\Botonera.exe
set ICON_ICO=E:\Apps\Botonera\rear-window.ico
set DESKTOP_LNK=%USERPROFILE%\Desktop\Botonera.lnk
set START_LNK=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Botonera.lnk

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
  "$wsh = New-Object -ComObject WScript.Shell; ^
   $sc1 = $wsh.CreateShortcut('%DESKTOP_LNK%'); ^
   $sc1.TargetPath = '%TARGET_EXE%'; ^
   $sc1.WorkingDirectory = 'E:\Apps\Botonera'; ^
   $sc1.IconLocation = '%ICON_ICO%,0'; ^
   $sc1.Description = 'Botonera - Centro de Accesos y Taller'; ^
   $sc1.Save(); ^
   $sc2 = $wsh.CreateShortcut('%START_LNK%'); ^
   $sc2.TargetPath = '%TARGET_EXE%'; ^
   $sc2.WorkingDirectory = 'E:\Apps\Botonera'; ^
   $sc2.IconLocation = '%ICON_ICO%,0'; ^
   $sc2.Description = 'Botonera - Centro de Accesos y Taller'; ^
   $sc2.Save();"

echo [OK] Acceso directo creado en tu Escritorio: %DESKTOP_LNK%
echo [OK] Acceso directo creado en el Menú Inicio: %START_LNK%
echo.
echo Abriendo Botonera en tu sesión Nico de Comet...
start "" "%TARGET_EXE%"
echo.
echo ¡Instalación completa! Ya podés abrir la Botonera desde tu Escritorio.
pause
