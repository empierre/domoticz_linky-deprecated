#!/bin/sh
<<<<<<< HEAD
#export LINKY_USERNAME="prenom.nom@mail.com"
#export LINKY_PASSWORD="password"
=======
export LINKY_USERNAME="nom.prenom@mail.com"
export LINKY_PASSWORD="password"
>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1

BASE_DIR="./"

export BASE_DIR
python3 $BASE_DIR/linky_json.py -o "$BASE_DIR" >> $BASE_DIR/linky.log 2>&1
<<<<<<< HEAD
node domoticz_linky.js 
=======
node domoticz_linky.js > req.sql
cat req.sql | sqlite3 /home/pi/domoticz/domoticz.db

>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1
