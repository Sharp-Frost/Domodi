var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Postal = require('postal')
var channel = Postal.channel();

var ScheduleSchema = new Schema({
    day: Number,
    hours: Number,
    minutes: Number
});

var ProfileSchema = new Schema({
    name: String,
    description: String,
    active: Boolean,
    delay: Number,
    unchangeable: Boolean,
    planning: [ScheduleSchema]
});


ProfileSchema.statics.activate = function activate(id) {
    // Deactivate all others
    console.log("Deactivating all other profile");

    return this.model('Profile').find({'active': true}, function (err, profiles) {
        if (err) {
            console.log("An error occured");
        } else {
            profiles.forEach(function (profile) {
                if (profile.unchangeable) {
                   // throw new Error('unchangeableActiveProfile');   //TODO : profile with unchangeable=true should not be changed automatically
                } else {
                    profile.active = false;
                    profile.save();
                }
            });
        }
    }).then(function () {
        // Activate profile
        console.log("Activating profile " + id);
        mongoose.model('Profile').findById(id, function (err, profile) {
            profile.active = true;
            profile.save();

            //Send postal notification
            channel.publish("profile.changed", profile);

            return profile;
        });
    });
};


module.exports = mongoose.model('Profile', ProfileSchema);
