const https = require('http');
const Rx = require('rx');

var Api = function(host, port) {

    this.host = host;
    this.port = port;

}

Api.prototype.postCheckin = function (checkinRequest) {

    return this.post('/checkins', checkinRequest);

};

Api.prototype.post = function(path, data) {

    return Rx.Observable.create(function(observer) {

        var dataString = JSON.stringify(data);

        var req = https.request({

            host : this.host,
            port : this.port,
            path : '/api/v1' + path,
            method : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            }

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

        req.on('error', function(error) {

            console.error(error);
            observer.onError(error);

        });

        req.write(dataString);

        // Dispose
        return function httpGetDispose() {
            req && req.abort();
        };

    });

};

module.exports = Api;
