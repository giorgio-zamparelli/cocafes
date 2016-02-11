var UUID = require('./UUID.js');

var PersonStorage = function (database) {

    this.collection = database.collection('Person');

};

PersonStorage.prototype.getPersonById = function (personId, success) {

    this.collection.findOne({"_id": personId}, function(error, person) {

        if (error) throw error;

        if (success) {
            success(person);
        }

    });

};

PersonStorage.prototype.getPersonByFacebookId = function (facebookId, success) {

    this.collection.findOne({"facebookId": facebookId}, function(error, person) {

        if (error) throw error;

        if (success) {
            success(person);
        }

    });

};

PersonStorage.prototype.getPersonsByIds = function (personsIds, success) {

    this.collection.find({'_id': { $in: personsIds} }, function(error, persons) {

        if (error) throw error;

        if (success) {
            success(persons);
        }

    });

};

PersonStorage.prototype.addPerson = function (person, success) {

    if (!person._id) {
        person._id = UUID.generate();
    }

    this.collection.insert(person, function(error, person) {

        if (error) throw error;

        if (success) {
            success(person);
        }

    });

};

module.exports = PersonStorage;
