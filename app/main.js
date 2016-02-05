// var schedule = require('node-schedule');
//
// var rule = new schedule.RecurrenceRule();
// rule.second = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
//
// var job = schedule.scheduleJob(rule, function(){
//     console.log('The answer to life, the universe, and everything!');
// });

var menubar = require('menubar')({

    dir: __dirname,
    index: 'file://' + __dirname + '/index.html',
    width: 800,
    height: 600,
    preloadWindow: true,

});

menubar.on('ready', function ready () {

    console.log('app is ready')

    menubar.window.webContents.openDevTools();

});
