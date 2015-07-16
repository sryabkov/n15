var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var mongoose   = require('mongoose');

var uristring =
process.env.MONGOLAB_URI ||
process.env.MONGOHQ_URL ||
'mongodb://localhost:27017/n15';

mongoose.connect('mongodb://localhost'); // connect to our database

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
app.get('/', function(request, response) {
  response.render('pages/index')
});

// routes
var router = express.Router();

router.route('/players')
  .post(function(req, res) {
    var player = new Player();      // create a new instance of the Bear model
    player.firstname = req.body.firstname;
    player.lastname = req.body.lastname;
    player.email = req.body.email;
    console.log(player)
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

// all of our routes will be prefixed with /api
app.use('/api', router);


app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


