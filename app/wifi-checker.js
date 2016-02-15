'use strict';

const Api = require('./api.js');
const WiFiControl = require('./wifi-control.js');
const moment = require('moment');


var WifiChecker = function (localStorage) {

    this.api = new Api("localhost", 80);
    this.localStorage = localStorage;

    WiFiControl.init({
        debug: false
    });

};

WifiChecker.prototype.check = function () {

    var userId = this.localStorage.getItem("currentUserId");

    let ifaceState = WiFiControl.getIfaceState();

    //console.log(ifaceState);

    if (userId && ifaceState && ifaceState.mac && ifaceState.mac !== "0:0:0:0:0:0") {

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

            console.log(addCheckinRequest);

            this.sendCheckin(addCheckinRequest);

        }.bind(this));

    }

};

WifiChecker.prototype.sendCheckin = function (addCheckinRequest) {

    this.api.postCheckin(addCheckinRequest).subscribe(function(checkin){

        if (checkin) {

            console.log("Checked in at " + checkin.venueName + " at " + moment(checkin.creationTime).format("HH:mm:ss DD/MM/YYYY"));

        } else {

            console.log("Could not find any value matching the current wifi mac address");

        }

    });

};

module.exports = WifiChecker;
