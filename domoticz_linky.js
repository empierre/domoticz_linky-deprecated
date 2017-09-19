<<<<<<< HEAD
=======
//##############################################################################
//  This file is part of domoticz_linky - https://github.com/empierre/domotics_linky
//      Copyright (C) 2014-2017 Emmanuel PIERRE (domoticz@e-nef.com)
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
>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1

var fs = require('fs');
var winston = require('winston');
global.logger = winston;

var devicerowid=526;
var dateObj = new Date();
var q_year=dateObj.getUTCFullYear();
var q_month_s=dateObj.getUTCMonth();
var q_month_e=dateObj.getUTCMonth() + 1;
var q_day_s=dateObj.getUTCDate()-1;
var q_day_e=dateObj.getUTCDate();

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getTotal() {

	var obj = JSON.parse(fs.readFileSync('export_years_values.json', 'utf8'));
	var conso_cumul=0.0;
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		 conso_cumul= conso_cumul+ (obj[i]["conso"]);
	}
	return(conso_cumul);

}
function getYear(year) {

	var obj = JSON.parse(fs.readFileSync('export_years_values.json', 'utf8'));
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		 if (year == obj[i]["time"]) return (obj[i]["conso"]);
	}
}
function getMonth(month) {
	var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var obj = JSON.parse(fs.readFileSync('export_months_values.json', 'utf8'));
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		 if (mth[month-1] == obj[i]["time"]) return (obj[i]["conso"]);
	}
}
function getDay(day,month) {
	var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var obj = JSON.parse(fs.readFileSync('export_days_values.json', 'utf8'));
	var dm=''+pad(day,2)+" "+mth[month-1];
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		 if (dm == obj[i]["time"]) return (obj[i]["conso"]);
	}
}
function generateDay() {
	var cumul=getCumulBefore(q_year,q_month_s);
	var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var obj = JSON.parse(fs.readFileSync('export_days_values.json', 'utf8'));
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		var req_date=''+q_year+'-'+pad((mth.indexOf(obj[i]["time"].substr(3, 3))+1),2)+'-'+pad(obj[i]["time"].substr(0, 2),2);
		if (obj[i]["conso"]>0) {
<<<<<<< HEAD
			console.log('DELETE FROM \'Meter_Calendar\' WHERE devicerowid='+devicerowid+' and date = \''+req_date+'\'; INSERT INTO \'Meter_Calendar\' (DeviceRowID,Value,Counter,Date) VALUES ('+devicerowid+', \''+obj[i]["conso"]+'\', \''+Math.round(cumul*1000)/1000+'\', \''+req_date+'\')') ;
=======
			console.log('DELETE FROM \'Meter_Calendar\' WHERE devicerowid='+devicerowid+' and date = \''+req_date+'\'; INSERT INTO \'Meter_Calendar\' (DeviceRowID,Value,Counter,Date) VALUES ('+devicerowid+', \''+(obj[i]["conso"]*100)+'\', \''+Math.round(cumul*1000)/1000+'\', \''+req_date+'\');') ;
>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1
			cumul=cumul+(obj[i]["conso"]);
		}
	}
}
function getCumulBefore(year,month) {

	var obj = JSON.parse(fs.readFileSync('export_years_values.json', 'utf8'));
	var conso_cumul=0.0;
	for (var i = 0; i < Object.keys(obj).length; ++i) {
		 if (obj[i]["time"]<year) {
			 conso_cumul= conso_cumul+ (obj[i]["conso"]);
		}
	}
	var mth=[ 'Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var obj = JSON.parse(fs.readFileSync('export_months_values.json', 'utf8'));
	for (var i = 0; i < month-1; ++i) {
		 conso_cumul= conso_cumul+ (obj[i]["conso"]);
	}
	return(conso_cumul);
}


logger.add(winston.transports.File, {filename: './lnk95.log'});
<<<<<<< HEAD
logger.warn(getTotal());
=======
/*logger.warn(getTotal());
>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1
logger.warn(getYear(2017));
logger.warn(getMonth(9));
logger.warn(getMonth(9));
logger.warn(getDay(14,9));
logger.warn('update DeviceStatus set lastupdate = \''+q_year+'-'+pad(q_month_e,2)+'-'+pad(q_day_e,2)+' '+'00'+'\' where id = '+devicerowid);
<<<<<<< HEAD
//logger.warn(getCumulBefore(q_year,q_month_s));
=======
logger.warn(getCumulBefore(q_year,q_month_s));*/
>>>>>>> 3aa248368b9db133ecf018984551a9cfad05d6f1
generateDay();


