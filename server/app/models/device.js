var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var DeviceSchema   = new Schema({
    name: String,
    type: String,
    location: String
});


module.exports = mongoose.model('Device', DeviceSchema);