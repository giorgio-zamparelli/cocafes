var https = require('https');
var Rx = require('rx');

function Facebook(client_id, redirect_uri, client_secret) {

    this.client_id = client_id;
    this.redirect_uri = redirect_uri;
    this.client_secret = client_secret;

}

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

        return function httpGetDispose() {
            req && req.abort();
        };

    }.bind(this));

};

module.exports = Facebook;
