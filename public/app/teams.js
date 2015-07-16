angular.module('n15-teams', ['ngResource'])
  .factory('TeamService', ['$resource', function($resource) {
      return $resource('/api/teams', {team: '@team'});
    }])
  .controller('teamController', ['TeamService', '$scope', function(TeamService, $scope) {
    $scope.teams = TeamService.query();
  }]);
