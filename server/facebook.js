var https = require('https');
var Rx = require('rx');

function Facebook(client_id, redirect_uri, client_secret) {

    this.client_id = client_id;
    this.redirect_uri = redirect_uri;
    this.client_secret = client_secret;

}

Facebook.prototype.getUserProfile = function () {

    return this.get('me', { 'fields': "id,first_name,last_name,email,friends{id,first_name,last_name},picture"});

};

Facebook.prototype.getAccessToken = function (code) {

    return Rx.Observable.create(function(observer) {

        var req = https.get({
            host : 'graph.facebook.com',
            port : 443,
            path : '/v2.5/oauth/access_token?client_id=' + this.client_id + "&redirect_uri=" + this.redirect_uri + "&client_secret=" + this.client_secret + "&code=" + code,
            method : 'GET'
        }, function(response) {

            var body = "";
            response.on('data', function(data) {
                body += data;
            });

            response.on('end', function() {

                observer.onNext(JSON.parse(body));
                observer.onCompleted();

            });

        });

        req.on('error', function(err) {
            observer.onError(err);
        });

        // Dispose
        return function httpGetDispose() {
            req && req.abort();
        };

    }.bind(this));

};

Facebook.prototype.get = function(path, parameters) {

    return Rx.Observable.create(function(observer) {

        var parametersString = "";

        for (parameter in parameters) {
            parametersString += "&" + parameter + "=" + parameters[parameter];
        }

        var req = https.get({
            host : 'graph.facebook.com',
            port : 443,
            path : '/v2.5/' + path + '?' + parametersString + '&client_id=' + this.client_id + "&redirect_uri=" + this.redirect_uri + '&access_token=' + this.access_token,
            method : 'GET'
        }, function(response) {

            var body = "";
            response.on('data', function(data) {
                body += data;
            });

            response.on('end', function() {

                observer.onNext(JSON.parse(body));
                observer.onCompleted();

            });

        });

        req.on('error', function(err) {
            observer.onError(err);
        });

        // Dispose
        return function httpGetDispose() {
            req && req.abort();
        };

    }.bind(this));

};

module.exports = Facebook;
