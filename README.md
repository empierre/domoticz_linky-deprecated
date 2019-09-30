# domoticz_linky
Get Linky smart meter data and push it to domoticz

If you appreciate this software, please show it off ! [![PayPal donate button](http://img.shields.io/paypal/donate.png?color=yellow)](https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=epierre@e-nef.com&currency_code=EUR&amount=&item_name=thanks "Donate once-off to this project using Paypal")


# pre-requisite: activate load curve recording on Enedis website
enable your enedis account (https://espace-client-particuliers.enedis.fr/group/espace-particuliers/) and the data collection ("Consommation" > "Gérer ma courbe de charge" > "Activer ma courbe de charge")

# create a device in Domoticz
- In Domoticz, go to hardware, create a virtual "rfx meter counter" or "Dummy".
- Then in Devices, add it to the devices. (mark down the id for later).
- When in Utility, edit the device and change it to Electric (instant+counter)  type .

## modules to install

    sudo apt-get install sqlite3 node npm
    sudo apt-get install python3 python3-numpy python3-dateutil python3-requests
## deploy
    cd <whereyouwant> ie. /home/pi/domoticz/plugins/
    git clone https://github.com/empierre/domoticz_linky.git
    cd domoticz_linky
    npm install winston@2.4.2

## rename configuration file, change login/pass/id

    cp _domoticz_linky.cfg domoticz_linky.cfg
    nano domoticz_linky.cfg

and change:

    LINKY_USERNAME="username@mail.com"
    LINKY_PASSWORD="password"
    DOMOTICZ_ID=547
    
Where DOMOTICZ_ID is id device on domoticz. 

Configuration file will not be deleted in future updates


## testing before launch

Manually launch

    ./domoticz_linky.sh

N.B. If login is not ok, you'll get a nodejs error on console for data will be missing (will be changed).

Then check the login credential if they are ok:

    domoticz_linky.log

If this is good, you'll get several json files in the directory

## Add to your cron tab (with crontab -e):

    30 7,17 * * * /home/pi/domoticz_linky/domoticz_linky.sh

## Getting back history

  It is possible to get back history months giving the relative month to get. Parameter is how many month back from today. Limitation: works only on same year at this time.

    ./domoticz_linky_month.sh 3
    
 On example, 3 months before.
