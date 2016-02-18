'use strict';

const packageJson = require('./package.json');
const LocalStorage = require('node-localstorage').LocalStorage;
const GithubReleases = require('electron-gh-releases');
const Api = require('./api.js');
const WifiChecker = require('./wifi-checker.js');


const environment = process.env.NODE_ENV;
global.environment = environment;

if ("development" !== environment) {

    var AutoLaunch = require('auto-launch');

    var autoLaunch = new AutoLaunch({
        name: packageJson.name
    });

    autoLaunch.enable(function(error){

    	if (error) {
    		console.error(error);
    	} else {
    		console.log("autolaunch has been enabled");
    	}

    });

}

var menubar = require('menubar')({

    "dir": __dirname,
    "index": 'file://' + __dirname + '/index.html',
    "name" : packageJson.name,
    "title" : packageJson.name,
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
	currentVersion: packageJson.version
});

updater.check((error, status) => {

	// `status` is true if there is a new update available
	if (!error && status) {
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
