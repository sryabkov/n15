var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TeamSchema   = new Schema({
    id: Number,
    city: String,
    teamName: String,
    teammates: String
});

module.exports = mongoose.model('Team', TeamSchema);
