#!/bin/sh
set -au

SCRIPT=$(readlink -f "$0")
BASE_DIR=$(dirname "${SCRIPT}")
export BASE_DIR
CFG_FILE="domoticz_linky.cfg"
LOG_FILE="domoticz_linky.log"
MONTH=0

if [ $# -eq 1 ]
then
    MODE="monthly"
    MONTH="$1"
else
    MODE="daily"
fi
echo "${MODE} mode" >> "${BASE_DIR}"/"${LOG_FILE}"

update_db () {
  if [ "$1" -eq 0 ]
  then
     PY_SCRIPT="linky_json.py"
  else
     PY_SCRIPT="linky_month.py"
  fi
  PY_SCRIPT="${BASE_DIR}"/"${PY_SCRIPT}"
  /usr/bin/python3 "${PY_SCRIPT}" $1 -o "${BASE_DIR}" >> "${BASE_DIR}"/"${LOG_FILE}" 2>&1
  if  [ $? -eq 0 ]; then
    BASE_DIR="${BASE_DIR}" /usr/bin/nodejs "${BASE_DIR}"/domoticz_linky.js "${DOMOTICZ_ID}" > "${BASE_DIR}"/req.sql
     cat "${BASE_DIR}"/req.sql | /usr/bin/sqlite3 "${HOME}"/domoticz/domoticz.db
  fi
}

# check configuration file
if [ -f "${BASE_DIR}"/"${CFG_FILE}" ]
then
  . "${BASE_DIR}"/"${CFG_FILE}"
  export LINKY_USERNAME
  export LINKY_PASSWORD
  export DOMOTICZ_ID
  update_db "${MONTH}"
else
    echo "Config file is missing ["${BASE_DIR}"/"${CFG_FILE}"]"
    exit 1
fi
