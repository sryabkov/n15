angular.module('Games', ['ngResource'])
  .factory('GameService', ['$resource', function($resource) {
    return $resource('/api/games', {game: '@game'});
  }])
  .controller('gamesController', ['GameService','TeamService', function (GameService, TeamService) {

    var self = this;
    self.games = GameService.query();
    self.teams = TeamService.query();

    // convert teams id to team name
    self.getTeamName = function(id) {
      return self.teams[id-1  ].teamName
    }
    self.highlight = function() {

    }
  }]);
