var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlayerSchema   = new Schema({
    firstname: String,
    lastname: String,
    email: String
});

module.exports = mongoose.model('Player', PlayerSchema);
