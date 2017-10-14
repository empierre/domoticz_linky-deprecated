#!/bin/sh
export LINKY_USERNAME="nom.prenom@mail.com"
export LINKY_PASSWORD="password"

BASE_DIR="/home/pi/domoticz/domoticz_linky"

export BASE_DIR
cd $BASE_DIR
python3 $BASE_DIR/linky_json.py -o "$BASE_DIR" >> $BASE_DIR/linky.log 2>&1
<<<<<<< HEAD
node $BASE_DIR/domoticz_linky.js > req.sql
cat $BASE_DIR/req.sql | sqlite3 /home/odroid/domoticz/domoticz.db
~

=======
node domoticz_linky.js > req.sql
cat req.sql | sqlite3 /home/pi/domoticz/domoticz.db
>>>>>>> 0f899ad2b2e1717e7227defebf002a40abcf2fb5
