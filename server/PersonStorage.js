var PersonStorage = function (mongoose) {

    var personSchema = new mongoose.Schema({

        _id: String,
        firstname: String,
        lastname: String,
        facebookId: { type: String, required: true, unique: true },
        friendsIds: Array

    });

    this.collection = mongoose.model('Person', personSchema, 'Person');

};

PersonStorage.prototype.getPersonBydId = function (personId, success) {

    this.collection.findById(personId, function(error, person) {

        if (error) throw error;

        if (success) {
            success(person);
        }

    });

};

PersonStorage.prototype.getPersonsBydIds = function (personsIds, success) {

    this.collection.findById(personsIds, function(error, persons) {

        if (error) throw error;

        if (success) {
            success(persons);
        }

    });

};

module.exports = PersonStorage;
