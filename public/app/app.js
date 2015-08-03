angular.module('n15', ['ngRoute','Teams', 'Games', 'Stats'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
      templateUrl: 'app/stats/standings.html',
      controller: 'statsController as ctrl'
    })
    .when('/teams', {
      templateUrl: 'app/teams/teams.html',
      controller: 'teamsController',
      controllerAs: 'ctrl'
    })
    .when('/new', {
      templateUrl: 'app/games/newGame.html',
      controller: 'gamesController',
      controllerAs: 'ctrl'
    })
    .when('/games', {
      templateUrl: 'app/games/games.html',
      controller: 'gamesController',
      controllerAs: 'ctrl'
    })
    .otherwise({redirectTo: '/'})
  }])

  .controller('navController', function() {
    this.navigation = [
      {
        url: 'games',
        label: 'Games'
      },
      {
        url: 'new',
        label: 'Add Game'
      }
    ];

  });
