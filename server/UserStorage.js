var UUID = require('./UUID.js');

var UserStorage = function (database) {

    this.collection = database.collection('User');

};

UserStorage.prototype.getUserById = function (userId, success) {

    this.collection.findOne({"_id": userId}, function(error, user) {

        if (error) throw error;

        if (success) {
            success(user);
        }

    });

};

UserStorage.prototype.getUserByFacebookId = function (facebookId, success) {

    this.collection.findOne({"facebookId": facebookId}, function(error, user) {

        if (error) throw error;

        if (success) {
            success(user);
        }

    });

};

UserStorage.prototype.getUsersByIds = function (usersIds, success) {

    this.collection.find({'_id': { $in: usersIds} }, function(error, users) {

        if (error) throw error;

        if (success) {
            success(users);
        }

    });

};

UserStorage.prototype.addUser = function (user, success) {

    if (!user._id) {
        user._id = UUID.generate();
    }

    this.collection.insert(user, function(error, user) {

        if (error) throw error;

        if (success) {
            success(user);
        }

    });

};

module.exports = UserStorage;
