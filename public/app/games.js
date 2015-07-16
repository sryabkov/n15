angular.module('n15-games', ['ngResource'])
  .factory('GamesService', ['$resource', function($resource) {
      return $resource('/api/games', {game: '@game'});
    }])
  .controller('gameController', ['GamesService', '$scope', function(GameService, $scope) {
    $scope.games = GameService.query();
  }]);
