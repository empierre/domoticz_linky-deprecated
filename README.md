# domoticz_linky
get Linky smart meter data and push it to domoticz

# create a device in Domoticz
- In Domoticz, go to hardware, create a virtual "rfx meter counter".
- Then in Devices, add it to the devices. (mark down the id for later).
- When in Utility, edit the device and change it to Electricity type.

## modules to install

    sudo apt-get install sqlite3
    npm install winston 
    git clone https://github.com/empierre/domoticz_linky.git

## change login and pass, base dir of this script and domoticz path

    nano domoticz_linky.sh

and change:
export LINKY_USERNAME="nom.prenom@mail.com"
export LINKY_PASSWORD="password"

    nano domoticz_linky.js
    
change the devide ID there:
    var devicerowid=526;

## testing before launch

Manually launch

    ./domoticz_linky.sh

N.B. If login is not ok, you'll get a nodejs error on console for data will be missing (will be changed).

Then check the login credential if they are ok:

    linky.log

If this is good, you'll get several json files in the directory

## Add to your cron tab (with crontab -e):

30 7,12,17,22 * * * /home/pi/domoticz_linky/domoticz_linky.sh
