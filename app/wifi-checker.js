'use strict';

const Api = require('./api.js');
const WiFiControl = require('./wifi-control.js');


var WifiChecker = function (localStorage) {

    this.api = new Api("localhost", 80);
    this.localStorage = localStorage;

    WiFiControl.init({
        debug: false
    });

};

WifiChecker.prototype.check = function () {

    let ifaceState = WiFiControl.getIfaceState();

    WiFiControl.scanForWiFi( function(error, response) {

        if (error) {

            console.log(error);

        } else if (response) {

            //console.log(response);

            let addCheckinRequest = {};

            let ifaceState = WiFiControl.getIfaceState();
            addCheckinRequest.userId = this.localStorage.getItem("currentUserId");

            if (ifaceState) {

                addCheckinRequest.connectedWifi = {};
                addCheckinRequest.connectedWifi.mac = ifaceState.mac;
                addCheckinRequest.connectedWifi.ssid = ifaceState.ssid;

            }

            addCheckinRequest.visibleWifis = [];

            if (response.networks && response.networks.length > 0) {

                for (let i = 0; i < response.networks.length; i++) {

                    addCheckinRequest.visibleWifis.push({

                        "mac" : response.networks[i].mac,
                        "ssid" : response.networks[i].ssid,
                        "channel" : response.networks[i].channel,
                        "signal" : response.networks[i].signal_level,
                        "security" : response.networks[i].security

                    });

                }

            }

            console.log(addCheckinRequest);

            this.api.postCheckin(addCheckinRequest).subscribe(function(checkin){

                console.log(checkin);

            });



        }

    }.bind(this));

};

module.exports = WifiChecker;
