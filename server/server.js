/*jshint unused: false, node: true */
/*jslint unparam: true, node: true */

'use strict';

var express = require('express');
var mongojs = require('mongojs')
var Facebook = require('./Facebook.js');
var PersonStorage = require('./PersonStorage.js');
var swagger_node_express = require("swagger-node-express");
var bodyParser = require( 'body-parser' );
var app = express();

var swagger = swagger_node_express.createNew(app)

var facebook = new Facebook("1707859876137335", "https://www.facebook.com/connect/login_success.html", "bfc74d90801f5ca51febb8c47d4f146b");

//var database = mongojs('mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x');
var database = mongojs('mongodb://localhost:27017/coworker'); //mongod --dbpath ~/mongodb/coworker/

var personStorage = new PersonStorage(database);

app.set('port', (process.env.PORT || 3000));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Swagger https://github.com/swagger-api/swagger-node/issues/189

swagger.addPost({

    'spec': {
        path : "/api/v1/authentication/login/facebook",
        nickname : "people"
    },
    'action': function(request, response, next) {

        var facebookCode = request.headers.authorization.replace("Facebook ", "");
        facebook.getAccessToken(facebookCode).subscribe(function(accessTokenResponse) {

            console.log(response);
            facebook.access_token = accessTokenResponse.access_token;

            facebook.getUserProfile().subscribe(function(facebookUser) {

                personStorage.getPersonByFacebookId(facebookUser.id, function(person) {

                    if (person) {

                        response.json(person);

                    } else {

                        person = {};
                        person.facebookId = facebookUser.id;
                        person.facebookToken = facebook.access_token;
                        person.firstname = facebookUser.first_name;
                        person.lastname = facebookUser.last_name;
                        person.friendsIds = [];

                        personStorage.addPerson(person, function(person) {

                            response.json(person);

                        });

                    }

                });

            });

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/people/{personId}",
        parameters : [swagger_node_express.pathParam("personId", "ID of person that needs to be fetched", "string")],
        nickname : "people"
    },
    'action': function(request, response, next) {

        var personId = request.params.personId;

        personStorage.getPersonById(personId, function(person) {

            if (person) {
                response.json(person);
            } else {
                response.status(404).send();
            }

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/people/{personId}/friends",
        parameters : [swagger_node_express.pathParam("personId", "ID of person that needs to be fetched", "string")],
        nickname : "friends"
    },
    'action': function(request, response, next) {

        var personId = request.params.personId;

        personStorage.getPersonById(personId, function(person) {

            if (person) {

                personStorage.getPersonsByIds(person.friendsIds, function(persons) {

                    response.json(persons);

                });

            } else {
                response.status(404).send();
            }

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/people",
        nickname : "people"
    },
    'action': function(request, response, next){

        response.json({"629795542":{"id": "629795542", "firstname":"Giorgio","friendsIds":["703176770","547535464"]}, "703176770":{"firstname":"Mathilde"}, "547535464": {"firstname":"Dries"}});

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/venues",
        nickname : "people"
    },
    'action': function(request, response, next){

        response.json([{"name":"Coworking café"},{"name":"CAMP"}]);

    }

});

swagger.setApiInfo({
    title: "Coworker API",
    description: "Coworker API description",
    termsOfServiceUrl: "",
    contact: "giorgio.zamparelli@gmail.com",
    license: "",
    licenseUrl: ""
});
swagger.configureSwaggerPaths("", "docs/api-docs.json", "");
swagger.configure("http://localhost:3000", "1.0.0");

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

    var host = server.address().address;
    var port = server.address().port;

    console.log('coworker-server listening on http://%s:%s', host, port);

});
