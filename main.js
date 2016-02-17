'use strict';

const LocalStorage = require('node-localstorage').LocalStorage;
const GithubReleases = require('electron-gh-releases');
const Api = require('./api.js');
const WifiChecker = require('./wifi-checker.js');
const AutoLaunch = require('auto-launch');

const environment = process.env.NODE_ENV;
global.environment = environment;

var appLauncher = new AutoLaunch({
	name: 'Cocafes'
});

appLauncher.isEnabled(function(enabled) {

	if(enabled) return;

	appLauncher.enable(function(error) {

	});

});

var menubar = require('menubar')({

    "dir": __dirname,
    "index": 'file://' + __dirname + '/index.html',
    "icon": 'file://' + __dirname + '/IconTemplate.png',
    "name" : "cocafes",
    "title" : "cocafes",
    "width": 320,
    "height": 480,
    "min-width": 320,
    "min-height": 480,
    "max-width": 320,
    "max-height": 480,
    "preloadWindow": true,

});

global.userDataPath = menubar.app.getPath("userData").replace("Electron", "cocafes");
global.host = "cocafes.herokuapp.com";
global.port = 443;

if ("development" === environment) {
	//global.host = "localhost";
	//global.port = 80;
}

const api = new Api(global.host, global.port);

var nodeLocalStorage = new LocalStorage(global.userDataPath);

let wifiChecker = new WifiChecker(nodeLocalStorage, api);

const updater = new GithubReleases({
	repo: 'giorgio-zamparelli/cocafes',
	currentVersion: menubar.app.getVersion()
});

// Check for updates
updater.check((error, status) => {

	// `status` is true if there is a new update available
	if (!error && status) {
		// Download the update
		updater.download();
	}

});

updater.on('update-downloaded', (info) => {

	// Restart the app and install the update
	updater.install();

});

var schedule = require('node-schedule');
var rule = new schedule.RecurrenceRule();
//rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; //every 5 seconds
rule.second = [0]; //every minute //TODO is actually running every 0th second of a minute

var job = schedule.scheduleJob(rule, function(){

    wifiChecker.check();

});

menubar.on('ready', function ready () {

    if ("development" === environment) {
        menubar.window.webContents.openDevTools({detach:true});
    }

});
