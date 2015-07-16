angular.module('n15-teams', ['ngResource'])
  .factory('TeamsService', ['$resource', function($resource) {
      return $resource('/api/teams', {team: '@team'});
    }])
  .controller('teamController', ['TeamsService', '$scope', function(TeamsService, $scope) {
    $scope.teams = TeamsService.query();
  }]);
