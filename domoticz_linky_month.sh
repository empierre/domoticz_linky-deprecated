#!/bin/sh
export LINKY_USERNAME="nom.prenom@mail.com"
export LINKY_PASSWORD="password"

BASE_DIR="/home/pi/domoticz/domoticz_linky"

export BASE_DIR
cd $BASE_DIR
python3 $BASE_DIR/linky_montyh.py $1 -o "$BASE_DIR" >> $BASE_DIR/linky.log 2>&1

node $BASE_DIR/domoticz_linky.js > req.sql
cat $BASE_DIR/req.sql | sqlite3 /home/pi/domoticz/domoticz.db
