#!/bin/sh
#export LINKY_USERNAME="prenom.nom@gmail.com"
#export LINKY_PASSWORD="password"

BASE_DIR="./"

export BASE_DIR
python3 $BASE_DIR/linky_json.py -o "$BASE_DIR" >> $BASE_DIR/linky.log 2>&1
node domoticz_linky.js 
