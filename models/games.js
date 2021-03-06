var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GameSchema   = new Schema({
    id: {type: Number, min: 1 },
    date: String,
    awayTeamId: String,
    homeTeamId: String,
    finalScoreAwayTeam: {type: Number, min: 0 },
    finalScoreHomeTeam: {type: Number, min: 0 },
    hadOT: Boolean,
    hadSO: Boolean
  });

module.exports = mongoose.model('Game', GameSchema);
