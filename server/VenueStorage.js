var UUID = require('./UUID.js');

var VenueStorage = function (database) {

    this.collection = database.collection('Venue');

};

VenueStorage.prototype.getVenueById = function (venueId, success) {

    this.collection.findOne({"_id": venueId}, function(error, venue) {

        if (error) throw error;

        if (success) {
            success(venue);
        }

    });

};

VenueStorage.prototype.getVenueByLatitudeAndLongitude = function (latitude, longitude, success) {

    this.collection.find({}, function(error, venue) {

        if (error) throw error;

        if (success) {
            success(venue);
        }

    });

};

VenueStorage.prototype.getVenueByMac = function (mac, success) {

    this.collection.findOne({"wifis.mac": mac}, function(error, venue) {

        if (error) throw error;

        if (success) {
            success(venue);
        }

    });

};

VenueStorage.prototype.addVenue = function (venue, success) {

    if (!venue._id) {
        venue._id = UUID.generate();
    }

    this.collection.insert(venue, function(error, venue) {

        if (error) throw error;

        if (success) {
            success(venue);
        }

    });

};

module.exports = VenueStorage;
