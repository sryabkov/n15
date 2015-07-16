var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var mongoose   = require('mongoose');

var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost:27017/n15';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + uristring);
  }
});

var Player = require('./models/players.js');
var Team = require('./models/teams.js');
var Game = require('./models/games.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// home
app.get('/', function(req, res) {
  res.render('pages/index')
});

app.get('/teams', function(req, res) {
  res.render('pages/teams');
});

app.get('/games', function(req, res) {
  res.render('pages/games');
});

// routes
var router = express.Router();

router.route('/players')
  .post(function(req, res) {
    var player = new Player();      // create a new instance of the Bear model
    player.firstname = req.body.firstname;
    player.lastname = req.body.lastname;
    player.email = req.body.email;

    // save the player and check for errors
    player.save(function(err) {
      if (err)
        res.send(err);

      res.json({ message: 'Player created!' });
    });
  })
  .get(function(req, res) {
    Player.find(function(err, player) {
      if (err)
        res.send(err);

      res.json(player);
    });
  });

router.route('/teams')
  .post(function(req, res) {
    var team = new Team();
    team.id = req.body.id;
    team.city = req.body.city;
    team.teamName = req.body.teamName;
    team.teammates = req.body.teammates;
    team.save(function(err) {
      if(err)
        res.send(err);
      res.json({message:"Team Saved"})
    });
  })
  .get(function(req, res) {
    Team.find(function(err, team) {
      if(err)
        res.send(err);
      res.json(team);
    });
  })

router.route('/games')
  .post(function(req, res) {
    var game = new Game();
    game.date = req.body.date;
    game.id = req.body.id;
    game.awayTeamId = req.body.awayTeamId;
    game.homeTeamId = req.body.homeTeamId;
    game.finalScoreAwayTeam = req.body.finalScoreAwayTeam;
    game.finalScoreHomeTeam = req.body.finalScoreHomeTeam;
    game.hadOT = req.body.hadOT;
    game.hadSO = req.body.hadSO;

    game.save(function(err) {
      if(err)
        res.send(err);
      res.json({message:"Game Saved"})
    });
  })
  .get(function(req, res) {
    Game.find(function(err, game) {
      if(err)
        res.send(err);
      res.json(game);
    });
  })

// all of our routes will be prefixed with /api
app.use('/api', router);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


