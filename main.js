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

})
