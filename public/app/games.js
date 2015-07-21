angular.module('n15-games', ['ngResource', 'n15-teams'])
  .factory('GamesService', ['$resource', function($resource) {
      return $resource('/api/games', {game: '@game'});
    }])
  .controller('gameController', ['GamesService', 'TeamsService', '$scope', function(GamesService, TeamsService, $scope) {
    $scope.games = GamesService.query();
    $scope.teams = TeamsService.query();
  }]);
