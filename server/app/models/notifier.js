var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;


var NotifierSchema   = new Schema({
    name: String,
    apiKey: String,
    active: Boolean,

});


module.exports = mongoose.model('Notifier', NotifierSchema);