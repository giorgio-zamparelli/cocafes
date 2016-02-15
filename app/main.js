'use strict';

const LocalStorage = require('node-localstorage').LocalStorage;
const WifiChecker = require('./wifi-checker.js');

const AutoLaunch = require('auto-launch');

var appLauncher = new AutoLaunch({
	name: 'Cocafes'
});

appLauncher.isEnabled(function(enabled){
	if(enabled) return;

	appLauncher.enable(function(err){

	});

});

var menubar = require('menubar')({

    "dir": __dirname,
    "index": 'file://' + __dirname + '/index.html',
    "icon": 'file://' + __dirname + '/IconTemplate.png',
    "name" : "coworker",
    "title" : "coworker",
    "width": 320,
    "height": 480,
    "min-width": 320,
    "min-height": 480,
    "max-width": 320,
    "max-height": 480,
    "preloadWindow": true,

});

var nodeLocalStorage = new LocalStorage(menubar.app.getPath("userData").replace("Electron", "coworker"));
let wifiChecker = new WifiChecker(nodeLocalStorage);

const environment = process.env.NODE_ENV;

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
//rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; //every 5 seconds
rule.second = [0]; //every minute

var job = schedule.scheduleJob(rule, function(){

    wifiChecker.check();

});



menubar.on('ready', function ready () {

    if ("development" === environment) {
        menubar.window.webContents.openDevTools({detach:true});
    }

});
