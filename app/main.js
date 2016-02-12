'use strict';

const LocalStorage = require('node-localstorage').LocalStorage;
const WifiChecker = require('./wifi-checker.js');
var nodeLocalStorage = new LocalStorage('./data');
let wifiChecker = new WifiChecker(nodeLocalStorage);

var schedule = require('node-schedule');

var rule = new schedule.RecurrenceRule();
//rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]; //every 5 seconds
rule.second = [0]; //every minute

var job = schedule.scheduleJob(rule, function(){

    wifiChecker.check();

});

var menubar = require('menubar')({

    dir: __dirname,
    index: 'file://' + __dirname + '/index.html',
    width: 800,
    height: 600,
    preloadWindow: true,

});

menubar.on('ready', function ready () {

    menubar.window.webContents.openDevTools();

});
