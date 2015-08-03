angular.module('Games', ['ngResource'])
  .factory('GameService', ['$resource', function($resource) {
    return $resource('/api/games', {game: '@game'});
  }])
  .controller('gamesController', ['GameService','TeamService', '$q', function (GameService, TeamService, $q) {

    var self = this;
    self.games = GameService.query();
    self.teams = TeamService.query();

    $q.all([self.games.$promise, self.teams.$promise])
      .then(function() {
        self.teamSelect = _.map(self.teams, function(team) {
          return { id: team.id, label: team.teamName}
        })
        // console.log(self.teams, self.teamSelect)
      });

    // convert teams id to team name
    self.getTeamName = function(id) {
      return self.teams[id - 1].teamName
    }

    self.newGame = {};

    self.addGame = function() {
      self.newGame.id = self.games.length + 1;
      console.log(self.newGame.date);
      self.newGame.date = dateTransform(self.newGame.date);
      console.log(self.newGame);
      // self.newGame = GameService.save(self.newGame, function() {
      //   self.games = GameService.query();
      // });
    }

    function dateTransform(gameDate) {
      console.log(gameDate);
      var d = [gameDate.getMonth(),gameDate.getDay(), gameDate.getYear()];
      return d.join('/');
    }

  }]);
