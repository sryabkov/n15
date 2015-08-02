// Sub Modules
angular.module('Teams', ['ngResource'])
  .factory('TeamService', ['$resource', function($resource) {
    return $resource('/api/teams', {team: '@team'});
  }])
  .controller('teamsController', ['TeamService', '$q', function (TeamService, $q) {
    var self = this;
    self.teams = TeamService.query();
  }]);
