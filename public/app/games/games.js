angular.module('Games', ['ngResource'])
  .factory('GameService', ['$resource', function($resource) {
    return $resource('/api/games', {game: '@game'});
  }])
  .controller('gamesController', ['GameService','TeamService', function (GameService, TeamService) {
    var self = this;
    self.games = GameService.query();
    self.teams = TeamService.query();



    self.getName = function(id) {
      var name = _.find(self.teams, function(team) {
//        console.log(id, team)
        if(team.id === id ) {
          return team.teamName;
        }
      });
//      console.log('n:',id, name);
      return 'yes'
    }
//    console.log(self.games, self.teams)
  }]);