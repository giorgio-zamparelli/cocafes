'use strict';

const WiFiControl = require('./wifi-control.js');
const moment = require('moment');


var WifiChecker = function (localStorage, api) {

    this.api = api;
    this.localStorage = localStorage;

    WiFiControl.init({
        debug: false
    });

};

WifiChecker.prototype.check = function () {

    var userId = this.localStorage.getItem("currentUserId");

    let ifaceState = WiFiControl.getIfaceState();

    //console.log(ifaceState);

    if (!userId) {

        console.log("no checkin since user is not logged in");

    } else if (!ifaceState) {

        console.log("no checkin since ifaceState is undefined");

    } else if (!ifaceState.power) {

        console.log("no checkin since Wifi is turned off");

    } else if (!ifaceState.mac || ifaceState.mac === "00:00:00:00:00:00") {

        console.log("no checkin since not currently connected to any wifi");

    } else {

        let addCheckinRequest = {};
        addCheckinRequest.userId = userId;
        addCheckinRequest.connectedWifi = {};
        addCheckinRequest.connectedWifi.mac = ifaceState.mac;
        addCheckinRequest.connectedWifi.ssid = ifaceState.ssid;
        addCheckinRequest.visibleWifis = [];

        WiFiControl.scanForWiFi( function(error, response) {

            if (error) {

                console.log(error);

            } else if (response && response.networks && response.networks.length > 0) {

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

            //console.log(addCheckinRequest);

            this.sendCheckin(addCheckinRequest);

        }.bind(this));

    }

};

WifiChecker.prototype.sendCheckin = function (addCheckinRequest) {

    this.api.postCheckin(addCheckinRequest).subscribe(checkin => {

        if (checkin) {

            console.log("Checked in at " + checkin.venueName + " at " + moment(checkin.creationTime).format("HH:mm:ss DD/MM/YYYY"));

        } else {

            console.log("Could not find any value matching the current wifi mac address");

        }

    }, error => {

        console.log("It was not possible to POST the Checkin to the server");

    });

};

module.exports = WifiChecker;
