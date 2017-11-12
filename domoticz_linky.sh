#!/bin/sh
export LINKY_USERNAME="nom.prenom@mail.com"
export LINKY_PASSWORD="password"

BASE_DIR="/home/pi/domoticz/domoticz_linky"
DOMOTICZ_ID=547

export BASE_DIR
cd $BASE_DIR
python3 $BASE_DIR/linky_json.py -o "$BASE_DIR" >> $BASE_DIR/linky.log 2>&1

node $BASE_DIR/domoticz_linky.js $DOMOTICZ_ID > req.sql
cat $BASE_DIR/req.sql | sqlite3 /home/pi/domoticz/domoticz.db
