
#Change below to your parameters
set LINKY_USERNAME=mon@mail.com
set LINKY_PASSWORD=mod_pass
set DOMOTICZ_ID=id_of_domoticz_device

#do not change below
set BASE_DIR=%cd%
set CFG_FILE=domoticz_linky.cfg
set LOG_FILE=domoticz_linky.log
set PY_SCRIPT=gaspar_json.py
set PY_SCRIPT=%BASE_DIR%\%PY_SCRIPT%
set MONTH=0

if [%1] ==  [] (
    set MODE=monthly
    set MONTH=%1
	set PY_SCRIPT=linky_json.py
	set ARG=%1
) else (
    set MODE=daily
	set PY_SCRIPT=linky_month.py
	set MONTH=0
)

set PY_SCRIPT=%BASE_DIR%\%PY_SCRIPT%


%PY_SCRIPT% %MONTH% -o %BASE_DIR% >> %BASE_DIR%\%LOG_FILE%
  if errorlevel 0 (
    node %BASE_DIR%\domoticz_linky.js %DOMOTICZ_ID% > %BASE_DIR%\req.sql
    cat %BASE_DIR%\req.sql | sqlite3 %HOME%\domoticz\domoticz.db
  )


