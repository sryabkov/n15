angular.module('Stats', ['Teams', 'Games'])
  .controller('statsController', function (TeamService, GameService, StatsCalculator, ProgressGrid, $q) {

    var self = this,
        initTeams;

    self.title = 'Standings';

    self.games = GameService.query();
    self.teams = TeamService.query();

     // extend teams with defaults
    initTeams = function(teams) {
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

    self.reload = function() {
      self.teams = TeamService.query();
    }

    $q.all([self.games.$promise, self.teams.$promise])
      .then(function () {

        self.numberOfTeams = self.teams.length;
        self.gamesPlayed = self.games.length;
        self.totalGames = self.numberOfTeams * self.numberOfTeams - self.numberOfTeams;
        self.percentGamesPlayed = Math.round( self.games.length * 100 / self.totalGames );

        self.progressGrid = ProgressGrid.init(self.numberOfTeams);
        initTeams(self.teams);

        self.calculatedStanding = StatsCalculator.calculateStandings(self.games, self.teams, self.progressGrid);
      });

  })

  .factory('StatsCalculator', function() {
    var calc = {
      calculateStandings: function(games, teams, progressGrid) {

        angular.forEach(games, function(game) {
          var homeTeam = teams[game.homeTeamId - 1],
              awayTeam = teams[game.awayTeamId - 1]
              gameResult = {};

          if( game.finalScoreAwayTeam > game.finalScoreHomeTeam ) {
            gameResult.winningTeam = awayTeam;
            gameResult.winningTeamScore = game.finalScoreAwayTeam;
            gameResult.losingTeam = homeTeam;
            gameResult.losingTeamScore = game.finalScoreHomeTeam;
            gameResult.isOvertime = game.hadOT;
            gameResult.isShootout = game.hadSO;

          } else if ( game.finalScoreAwayTeam < game.finalScoreHomeTeam ) {
            gameResult.winningTeam = homeTeam;
            gameResult.winningTeamScore = game.finalScoreHomeTeam;
            gameResult.losingTeam = awayTeam;
            gameResult.losingTeamScore = game.finalScoreAwayTeam;
            gameResult.isOvertime = game.hadOT;
            gameResult.isShootout = game.hadSO;
          }
          calc.recordGameResults(gameResult);
          var formattedResult = game.finalScoreAwayTeam + "-" + game.finalScoreHomeTeam + " ";
          formattedResult += game.hadOT ? (game.hadSO ? 'SO' : 'OT') : '';
          progressGrid[homeTeam.id - 1][awayTeam.id - 1] = formattedResult;
        })
      },
      recordGameResults: function(gameResult) {

        var winningTeam = gameResult.winningTeam,
            losingTeam = gameResult.losingTeam,
            winningTeamScore = gameResult.winningTeamScore,
            losingTeamScore = gameResult.losingTeamScore,
            isOvertime = gameResult.isOvertime,
            isShootout = gameResult.isShootout;

          winningTeam.wins++;
          winningTeam.points += 2;
          losingTeam.regulationLosses++;

          if( isShootout ) {
            winningTeam.shootoutWins++;
            losingTeam.shootoutLoses++;
            losingTeam.overtimeShootoutLosses++;
            losingTeam.points += 1;
          }
          if( isOvertime ) {
            losingTeam.overtimeShootoutLosses++;
            losingTeam.points += 1;
          }

          winningTeam.gamesPlayed++;
          winningTeam.goalsFor += winningTeamScore;
          winningTeam.goalsAgainst += losingTeamScore;
          // console.log('w',winningTeam.goalsFor - winningTeam.goalsAgainst);
          winningTeam.goalDifferential = winningTeam.goalsFor - winningTeam.goalsAgainst;

          losingTeam.gamesPlayed++;
          losingTeam.goalsFor += losingTeamScore;
          losingTeam.goalsAgainst += winningTeamScore;
          // console.log('l:', losingTeam.goalsFor - losingTeam.goalsAgainst);
          losingTeam.goalDifferential = losingTeam.goalsFor - losingTeam.goalsAgains;

          winningTeam.regulationOvertimeWins = winningTeam.wins - winningTeam.shootoutWins;
          losingTeam.regulationOvertimeWins = losingTeam.wins - losingTeam.shootoutWins;

      }
    }

  return calc;

  })
  .factory('ProgressGrid', function() {
    var grid = {
      init: function(numberOfTeams) {
        var g = new Array(numberOfTeams)
        for(var i = 0; i < numberOfTeams; i++) {
          g[i] = new Array(numberOfTeams);
          for(var j = 0; j < numberOfTeams; j++) {
            g[i][j] = "";
          }
        }
        return g;
      }
    }
    return grid;
  });
