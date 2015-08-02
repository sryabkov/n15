angular.module('n15', ['ngRoute','Teams', 'Games'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      template: 'This Silly String'
    })
    .when('/Teams', {
      templateUrl: 'app/teams/teams.html',
      controller: 'teamsController',
      controllerAs: 'ctrl'
    })
    .when('/Games', {
      templateUrl: 'app/games/games.html',
      controller: 'gamesController',
      controllerAs: 'ctrl'
    })
    .otherwise({redirectTo: '/'})
  }])

  .controller('mainController',['$scope', function($scope) {
    console.log('Main')
  }])

  .controller('navController', ['$scope', function($scope) {
    $scope.navigation = ['Teams', 'Games', 'Add Game'];
  }]);
