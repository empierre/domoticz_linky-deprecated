# domoticz_linky
get Linky smart meter data and push it to domoticz

## modules to install

    sudo apt-get install sqlite3
    npm install winston 
    git clone https://github.com/empierre/domoticz_linky.git

## change login data and domoticz path

    nano domoticz_linky.sh

## launch the fleet !

    ./domoticz_linky.sh

## Add to your cron tab (with crontab -e):

30 7,12,17,22 * * * /home/pi/domoticz_linky/domoticz_linky.sh
