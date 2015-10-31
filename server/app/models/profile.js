var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var ProfileSchema   = new Schema({
    name: String,
    description: String,
    active: Boolean,
    delay: Number
});


module.exports = mongoose.model('Profile', ProfileSchema);