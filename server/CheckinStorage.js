const Rx = require('rx');
var UUID = require('./UUID.js');

var CheckinStorage = function (database) {

    this.collection = database.collection('Checkin');

};

CheckinStorage.prototype.getCheckinById = function (checkinId, success) {

    this.collection.findOne({"_id": checkinId}, function(error, checkin) {

        if (error) throw error;

        if (success) {
            success(checkin);
        }

    });

};

CheckinStorage.prototype.getLatestCheckinByUserId = function (userId, success) {

    return Rx.Observable.create(function(observer) {

        this.collection.findOne({"userId": userId}, function(error, checkin) {

            if(error) observer.onError(error);
            observer.onNext(checkin);
            observer.onCompleted();

        });

    }.bind(this));

};

CheckinStorage.prototype.getCheckinsByIds = function (checkinsIds, success) {

    this.collection.find({'_id': { $in: checkinsIds} }, function(error, checkins) {

        if (error) throw error;

        if (success) {
            success(checkins);
        }

    });

};

CheckinStorage.prototype.addCheckin = function (checkin, success) {

    if (!checkin._id) {
        checkin._id = UUID.generate();
    }

    this.collection.insert(checkin, function(error, checkin) {

        if (error) throw error;

        if (success) {
            success(checkin);
        }

    });

};

module.exports = CheckinStorage;
