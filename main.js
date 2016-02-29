'use strict';

const packageJson = require('./package.json');
const LocalStorage = require('node-localstorage').LocalStorage;
const GithubReleases = require('electron-gh-releases');
const Api = require('./api.js');
const WifiChecker = require('./wifi-checker.js');


const environment = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
global.environment = environment;

if ("production" === environment) {

    var process = require('process');

    process.on('uncaughtException', function (error) {
        console.trace(error);
    });

}

if ("production" === environment) {

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
    "index": 'file://' + __dirname + '/container.html',
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

global.app = menubar.app;
global.version = packageJson.version;
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

if ("production" === environment) {

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

}

let schedule = require('node-schedule');
let rule = new schedule.RecurrenceRule();
let secondStarting = new Date().getSeconds() + 1;
secondStarting = secondStarting > 59 ? 0 : secondStarting;
rule.second = [secondStarting]; //every minute starting immediately

let job = schedule.scheduleJob(rule, function(){

    wifiChecker.check();

});

menubar.on('ready', function ready () {

    if ("development" === environment) {

        menubar.window.webContents.openDevTools({detach:true});

        //show chrome://appcache-internals
        // var BrowserWindow = require('electron').BrowserWindow;
        // var chromeAppCacheInternalWindow = new BrowserWindow({ "width": 1000, "height": 670, "show": false, "node-integration": false });
        // chromeAppCacheInternalWindow.loadURL("chrome://appcache-internals");
        // chromeAppCacheInternalWindow.show();

    }

});
