/*jshint unused: false, node: true */
/*jslint unparam: true, node: true */

'use strict';

var express = require('express');
var mongoose = require('mongoose');
var Facebook = require('./facebook');
var swagger_node_express = require("swagger-node-express");
var bodyParser = require( 'body-parser' );
var app = express();

mongoose.set('debug', true);

var swagger = swagger_node_express.createNew(app)

var facebook = new Facebook("1707859876137335", "https://www.facebook.com/connect/login_success.html", "bfc74d90801f5ca51febb8c47d4f146b");

//mongoose.connect('mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x');
mongoose.connect('mongodb://localhost:27017/coworker'); //mongod --dbpath ~/mongodb/coworker/

var personSchema = new mongoose.Schema({

    _id: String,
    firstname: String,
    lastname: String,
    facebookId: { type: String, required: true, unique: true },
    friendsIds: Array

});

var Person = mongoose.model('Person', personSchema, 'Person');

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
        facebook.getAccessToken(facebookCode).subscribe(function(response) {

            console.log(response);
            facebook.access_token = response.access_token;

            facebook.getUserProfile().subscribe(function(user) {

                console.log(user);

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
    'action': function(request, response, next){

        var personId = request.params.personId;
        console.log('personId: ' + personId);

        Person.findById(personId, function(error, person) {

            console.log("Person.find result");
            console.log(error);
            console.log(person);

            if (error) throw error;
            response.json(person);

        });

    }

});

swagger.addGet({

    'spec': {
        path : "/api/v1/people/:personId/friends",
        nickname : "people"
    },
    'action': function(request, response, next){

        var personId = request.params.personId;

        // User.find({ _id: personId }, function(error, person) {
        //
        //     if (error) throw error;
        //     response.json(person);
        //
        // });

        response.json([{"firstname":"Mathilde", lastCheckin : {"time": 1454929223617, "venue": {"name": "Coworking café"}}}, {"firstname":"Dries", lastCheckin : {"time": 1454929321530, "venue": {"name": "CAMP"}}}]);

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
