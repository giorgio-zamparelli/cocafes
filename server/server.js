/*jshint unused: false, node: true */
/*jslint unparam: true, node: true */

'use strict';

const Rx = require('rx');
var express = require('express');
var mongojs = require('mongojs');
var swagger_node_express = require("swagger-node-express");
var bodyParser = require( 'body-parser' );
var Facebook = require('./Facebook.js');
var CheckinStorage = require('./CheckinStorage.js');
var UserStorage = require('./UserStorage.js');
var VenueStorage = require('./VenueStorage.js');
var app = express();

var swagger = swagger_node_express.createNew(app);

var facebook = new Facebook("1707859876137335", "https://www.facebook.com/connect/login_success.html", "bfc74d90801f5ca51febb8c47d4f146b");

var database = mongojs('mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x');
//var database = mongojs('mongodb://localhost:27017/cocafes'); //mongod --dbpath ~/mongodb/cocafes/

var checkinStorage = new CheckinStorage(database);
var userStorage = new UserStorage(database);
var venueStorage = new VenueStorage(database);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Swagger https://github.com/swagger-api/swagger-node/issues/189

swagger.addPost({

    'spec': {
        path : "/api/v1/authentication/login/facebook",
        nickname : "users"
    },
    'action': function(request, response, next) {

        var facebookCode = request.headers.authorization.replace("Facebook ", "");
        facebook.getAccessToken(facebookCode).subscribe(function(accessTokenResponse) {

            //console.log(response);
            facebook.access_token = accessTokenResponse.access_token;

            facebook.getUserProfile().subscribe(function(facebookUser) {

                //console.log(facebookUser);

                userStorage.getUserByFacebookId(facebookUser.id, function(user) {

                    if (user) {

                        response.json(user);

                    } else {

                        user = {};
                        user.facebookId = facebookUser.id;
                        user.facebookToken = facebook.access_token;
                        user.firstname = facebookUser.first_name;
                        user.lastname = facebookUser.last_name;

                        if (facebookUser.picture && facebookUser.picture.data && facebookUser.picture.data.url) {
                            user.picture = facebookUser.picture.data.url;
                        }

                        user.friendsIds = {};

                        if (facebookUser.friends && facebookUser.friends.data) {

                            for (let facebookFriend of facebookUser.friends.data) {

                                if (facebookFriend && facebookFriend.id && facebookFriend.id.length > 0) {
                                    user.friendsIds[facebookFriend.id] = true;
                                }

                            }

                        }

                        userStorage.addUser(user, function(user) {

                            response.json(user);

                        });

                    }

                });

            });

        });

    }

});

swagger.addPost({

    'spec': {
        path : "/api/v1/checkins",
        "parameters": [{"name": "body","description": "Add Checking Request","required": true,"type": "AddCheckinRequest","paramType": "body"}],
        nickname : "checkins"
    },
    'action': function(request, response, next) {

        let addCheckinRequest = request.body;

        if (addCheckinRequest.connectedWifi && addCheckinRequest.connectedWifi.mac) {

            let checkin = {};

            venueStorage.getVenueByMac(addCheckinRequest.connectedWifi.mac, function(venue) {

                if (venue) {

                    checkin.creationTime = new Date().getTime();
                    checkin.lastEditTime = checkin.creationTime;
                    checkin.userId = addCheckinRequest.userId;
                    checkin.venueId = venue._id;
                    checkin.venueName = venue.name;

                    checkinStorage.addCheckin(checkin, function(checkin) {

                        response.json(checkin);

                    });

                } else {

                    response.status(204).send();

                }

            });

        } else {

            response.status(204).send();

        }

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/users/{userId}",
        parameters : [swagger_node_express.pathParam("userId", "ID of user that needs to be fetched", "string")],
        nickname : "users"
    },
    'action': function(request, response, next) {

        var userId = request.params.userId;

        userStorage.getUserById(userId, function(user) {

            if (user) {
                response.json(user);
            } else {
                response.status(404).send();
            }

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/users/{userId}/friends",
        parameters : [swagger_node_express.pathParam("userId", "ID of user that needs to be fetched", "string")],
        nickname : "friends"
    },
    'action': function(request, response, next) {

        var userId = request.params.userId;

        userStorage.getUserById(userId, function(user) {

            if (user) {

                userStorage.getUsersByFacebookIds(Object.keys(user.friendsIds)).flatMap(Rx.Observable.from)
                .flatMap(user => {

                    return checkinStorage.getLatestCheckinByUserId(user._id).map(checkin => {

                        user.latestCheckin = checkin;

                        return user;

                    });

                })
                .toArray().subscribe(users => response.json(users));



            } else {
                response.status(404).send();
            }

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/users",
        nickname : "users"
    },
    'action': function(request, response, next){

        response.json({"629795542":{"id": "629795542", "firstname":"Giorgio","friendsIds":["703176770","547535464"]}, "703176770":{"firstname":"Mathilde"}, "547535464": {"firstname":"Dries"}});

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/venues",
        nickname : "users"
    },
    'action': function(request, response, next){

        response.json([{"name":"Coworking café"},{"name":"CAMP"}]);

    }

});

swagger.setApiInfo({
    title: "Cocafes API",
    description: "Cocafes API description",
    termsOfServiceUrl: "",
    contact: "giorgio.zamparelli@gmail.com",
    license: "",
    licenseUrl: ""
});
swagger.configureSwaggerPaths("", "docs/api-docs.json", "");
swagger.configure("http://localhost:" + app.get('port'), "1.0.0");

// Serve up swagger ui at /docs via static route
var docs_handler = express.static(__dirname + '/swagger-ui/');
app.get(/^\/docs(\/.*)?$/, function(req, res, next) {

    if (req.url === '/docs') { // express static barfs on root url w/o trailing slash
        res.writeHead(302, { 'Location' : req.url + '/' });
        res.end();
        return;
    }
    // take off leading /docs so that connect locates file correctly
    req.url = req.url.substr('/docs'.length);
    return docs_handler(req, res, next);

});

var server = app.listen(app.get('port'), function () {

    var host = server.address().address !== "::" ? server.address().address : "localhost";
    var port = server.address().port;

    console.log('cocafes server listening on http://%s:%s', host, port);

});
