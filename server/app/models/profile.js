var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ScheduleSchema   = new Schema({
    day: Number,
    hours: Number,
    minutes: Number
});

var ProfileSchema   = new Schema({
    name: String,
    description: String,
    active: Boolean,
    delay: Number,
    unchangeable: Boolean,
    planning:[ScheduleSchema]
});


module.exports = mongoose.model('Profile', ProfileSchema);