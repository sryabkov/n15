angular.module('Stats', ['Teams', 'Games'])
  .controller('statsController', function (TeamService, GameService, StatsCalculatorService, $q) {
    console.log('Stats');

    var self = this;
    self.title = 'Standings';

    var progressGrid = [],
        initProgressGrid,
        initTeams,
        calculateStandings,
        gameResults,
        formattedGameResults,
        numberOfTeams,
        totalGames,
        percentGamesPlayed,
        homeTeamWon,
        awayTeamWon;

    var games = GameService.query(),
        teams = TeamService.query();

    $q.all([games.$promise, teams.$promise])
      .then(function () {

        numberOfTeams = teams.length;
        totalGames = numberOfTeams * numberOfTeams - numberOfTeams;
        percentGamesPlayed = Math.round( games.length * 100 / totalGames );
        console.log('n:',numberOfTeams, totalGames, percentGamesPlayed, teams)

        initTeams();

      });

    initTeams = function() {
      console.log('initTeams');
      // extend teams with defaults
      angular.forEach(teams, function(team) {
        team.gamesPlayed = 0;
        team.wins = 0;
        team.regulationLosses = 0;
        team.overtimeShootoutLosses = 0;
        team.points = 0;
        team.shootoutWins = 0;
        team.shootoutLosses = 0;
        team.regulationOvertimeWins = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.goalDifferential = 0;
      });
    }

    self.teams = teams;

    // function calculateStandings(teams, games) {
    //   console.log('calcStandings', teams, games);
    //   initTeams();

    //   // determine winner
    //   var winner = function(homeTeamScore, awayTeamScore) {
    //     if( awayTeamScore > homeTeamScore ) {
    //       return 'away'
    //     } else if(awayTeamScore < homeTeamScore) {
    //       return 'home'
    //     }
    //   }

    // }

    // initProgressGrid = function(numberOfTeams) {
    //   console.log('initGrid');

    // }

  })
  .factory('StatsCalculatorService', function() {
    console.log('calc');
    var calc = {
      init: function() {

      },
      calculateStandings: function() {

      },
      recordGameResults: function() {

      }
    }

  return calc;
  });
