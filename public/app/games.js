angular.module('n15-games', ['ngResource', 'n15-teams'])
  .factory('GamesService', ['$resource', function($resource) {
      return $resource('/api/games', {game: '@game'});
    }])
  .controller('gameController', ['GamesService', 'TeamsService', '$scope', function(GamesService, TeamsService, $scope) {
    $scope.games = GamesService.query();
    $scope.teams = TeamsService.query();

    var team_name = function(id) {
      var name =  _.find($scope.teams, function(team) {
        return team.id = id;
      })
    }

    console.log(team_name(1))
  }]);
