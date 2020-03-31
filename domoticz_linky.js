//##############################################################################
//  This file is part of domoticz_linky - https://github.com/empierre/domoticz_linky
//      Copyright (C) 2014-2018 Emmanuel PIERRE (domoticz@e-nef.com)
//
//  domoticz_linky is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 2 of the License, or
//  (at your option) any later version.
//
//  MyDomoAtHome is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with MyDomoAtHome.  If not, see <http://www.gnu.org/licenses/>.
//##############################################################################

var fs = require('fs');
var winston = require('winston');
global.logger = winston;

const path = require('path');

var devicerowid=process.argv[2];
var dateObj = new Date();
var q_year=dateObj.getUTCFullYear();
var q_month_s=dateObj.getUTCMonth();
var q_month_e=dateObj.getUTCMonth() + 1;
var q_day_s=dateObj.getUTCDate()-1;
var q_day_e=dateObj.getUTCDate();
var q_hour=dateObj.getHours();
var q_minutes=dateObj.getUTCMinutes();

var BASE_DIR = process.env.BASE_DIR || '/home/pi/domoticz/domoticz_linky';

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getTotal() {
        try {
                var fileExport = 'export_years_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                var conso_cumul=0.0;
                for (var i = 0; i < Object.keys(obj).length; ++i) {
                         conso_cumul= conso_cumul+ (obj[i]["conso"]);
                }
                return(conso_cumul);
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_years_values.json : "+e);
        }

}
function getYear(year) {
        try {
                var fileExport = 'export_years_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                for (var i = 0; i < Object.keys(obj).length; ++i) {
                         if (year == obj[i]["time"]) return (obj[i]["conso"]);
                }
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_years_values.json : "+e);
        }
}
function getMonth(month) {
        var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        try {
                var fileExport = 'export_months_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                for (var i = 0; i < Object.keys(obj).length; ++i) {
                         if (mth[month-1] == obj[i]["time"]) return (obj[i]["conso"]);
                }
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_months_values.json : "+e);
        }
}
function getDay(day,month) {
        var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        try {
                var fileExport = 'export_days_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                var dm=''+pad(day,2)+" "+mth[month-1];
                for (var i = 0; i < Object.keys(obj).length; ++i) {
                         if (dm == obj[i]["time"]) return (obj[i]["conso"]);
                }
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_days_values.json : "+e);
        }
}
function generateDayHours() {
        var myDateObj = new Date();
        myDateObj.setUTCSeconds(0);
        myDateObj.setUTCMinutes(0);
        myDateObj.setUTCHours(0);
        var dateOffset = (24*60*60*1000) * 2; //2 days
        var dateOffset2 = 60*60*1000; //60 min
        myDateObj.setTime(myDateObj.getTime() - dateOffset);
        var cumul=getCumulBefore(myDateObj.getUTCFullYear(),myDateObj.getUTCMonth());

        try {
                var fileExport = 'export_hours_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                console.log('BEGIN TRANSACTION;') ;
                console.log('DELETE FROM \'Meter\' WHERE devicerowid='+devicerowid+';') ;
                for (var i = 0; i+1 < Object.keys(obj).length; i=i+2) {
                        myDateObj.setTime(myDateObj.getTime() + dateOffset2);
                        var req_date= myDateObj.getUTCFullYear() + "-" + ("0"+(myDateObj.getUTCMonth()+1)).slice(-2) + "-" + ("0" + myDateObj.getUTCDate()).slice(-2) + " " + ("0" + myDateObj.getUTCHours()).slice(-2) + ":" + ("0" + myDateObj.getUTCMinutes()).slice(-2) + ":00";
                        var conso = (obj[i]["conso"] + obj[i+1]["conso"]) / 2;
                        if (conso > 0) {
                                console.log('INSERT INTO \'Meter\' (DeviceRowID,Usage,Value,Date) VALUES ('+devicerowid+', \''+Math.round(conso*10000/2)+'\', \''+Math.round(cumul*1000)+'\', \''+req_date+'\');') ;
                                cumul=cumul+conso;
                        }
                }
                myDateObj.setTime(myDateObj.getTime() + dateOffset2);
                console.log('INSERT INTO \'Meter\' (DeviceRowID,Usage,Value,Date) VALUES ('+devicerowid+', \''+0+'\', \''+Math.round(cumul*1000)+'\', \''+req_date+'\');') ;
                console.log('COMMIT;') ;
        } catch (e) {
                // It isn't accessible
                console.log('ROLLBACK;') ;
                console.log("Exception opening export_hours_values.json : "+e);
        }
}
function getCumulBefore(year,month) {
        // Bring back the year-month previous total as domoticz expect it
        try {
                var fileExport = 'export_years_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

                var conso_cumul=0.0;
                for (var i = 0; i < Object.keys(obj).length; ++i) {
                         if (obj[i]["time"]<year) {
                                 conso_cumul= conso_cumul+ (obj[i]["conso"]);
                        }
                }
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_years_values.json : "+e);
        }
        var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        try {
                var fileExport = 'export_months_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                for (var i = 0; i < month-1; ++i) {
                         conso_cumul= conso_cumul+ (obj[i]["conso"]);
                }
                return(conso_cumul);
        } catch (e) {
                // It isn't accessible
                console.log("Exception opening export_months_values.json : "+e);
        }
}
function generateMonthDays() {
        var cumul=Number(getCumulBefore(q_year,q_month_s));
        var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

        try {
                var fileExport = 'export_days_values.json';
                var filePath = path.resolve(BASE_DIR, fileExport);
                var obj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                var lastVal = 0;
                console.log('BEGIN TRANSACTION;') ;
                for (var i = 0; i < Object.keys(obj).length; ++i) {
			var req_date=''+obj[i]["time"].substr(7, 4)+'-'+pad((mth.indexOf(obj[i]["time"].substr(3, 3))+1),2)+'-'+pad(obj[i]["time"].substr(0, 2),2);
                        if (obj[i]["conso"]>0) {
                                lastVal = Number((obj[i]["conso"]*1000).toFixed(2));
				console.log('DELETE FROM \'Meter_Calendar\' WHERE devicerowid='+devicerowid+' and date = \''+req_date+'\'; INSERT INTO \'Meter_Calendar\' (DeviceRowID,Value,Counter,Date) VALUES ('+devicerowid+', \''+lastVal+'\', \''+Math.round(cumul*1000)/1000+'\', \''+req_date+'\');') ;
                                cumul=cumul+(obj[i]["conso"]);
                        }
                }
                if (i > 0) {
                    var myDateObj = new Date();
                    var dateOffset = (24*60*60*1000) * 1; //1 day
                    myDateObj.setTime(myDateObj.getTime() + dateOffset);
                    var req_date= myDateObj.getUTCFullYear() + "-" + ("0"+(myDateObj.getUTCMonth()+1)).slice(-2) + "-" + ("0" + myDateObj.getUTCDate()).slice(-2) + " " + ("0" + myDateObj.getUTCHours()).slice(-2) + ":" + ("0" + myDateObj.getUTCMinutes()).slice(-2) + ":00";
                    //  prevent device to go red
                    // Doesn't work well
                    // console.log('UPDATE DeviceStatus SET LastUpdate=\''+req_date+'\' WHERE ID==\''+ devicerowid+'\';');              
                    // console.log('UPDATE DeviceStatus SET sValue=\''+lastVal+'\', LastUpdate=\''+req_date+'\' WHERE ID==\''+ devicerowid+'\';');              
                }
                console.log('COMMIT;') ;
        } catch (e) {
                // It isn't accessible
                console.log('ROLLBACK;') ;
                console.log("Exception opening export_months_values.json : "+e);
        }
}


logger.add(winston.transports.File, {filename: './lnk95.log'});
generateMonthDays();
generateDayHours();
var req_date=''+q_year+'-'+pad(q_month_e,2)+'-'+pad(q_day_s,2)+' '+pad(q_hour,2)+':'+pad(q_minutes,2)+':00';
console.log('UPDATE DeviceStatus SET lastupdate = \''+req_date+'\' WHERE id = '+devicerowid+';');
