angular.module('Stats', ['Teams', 'Games'])
  .controller('statsController', function (TeamService, GameService, StatsCalculator, ProgressGrid, $q, $scope) {

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
        team.regulationOvertimeLosses = 0;
        team.goalsFor = 0;
        team.goalsAgainst = 0;
        team.goalDifferential = 0;
      });
    }

    $scope.$watch('ctrl.games', function() {
      self.calculatedStanding = StatsCalculator.calculateStandings(self.games, self.teams, self.progressGrid);
    })

    $q.all([self.games.$promise, self.teams.$promise])
      .then(function () {

        self.numberOfTeams = self.teams.length;
        self.gamesPlayed = self.games.length;
        self.totalGames = self.numberOfTeams * self.numberOfTeams - self.numberOfTeams;
        self.percentGamesPlayed = Math.round( self.games.length * 100 / self.totalGames );

        self.progressGrid = ProgressGrid.init(self.numberOfTeams);
        initTeams(self.teams);

        self.calculatedStanding = StatsCalculator.calculateStandings(self.games, self.teams, self.progressGrid);
      })

  })

  .factory('StatsCalculator', function() {
    var calc = {
      calculateStandings: function(games, teams, progressGrid) {

        angular.forEach(games, function(game, index) {
          var homeTeam = teams[game.homeTeamId - 1],
              awayTeam = teams[game.awayTeamId - 1]
              gameResult = {},
              winner = {},
              loser = {},
              ot = {},
              standings = [];

          ot.isOvertime = game.hadOT;
          ot.isShootout = game.hadSO || false;
          console.log('set SO:', ot.isShootout);


          if( game.finalScoreAwayTeam > game.finalScoreHomeTeam ) {
            winner.team = awayTeam;
            winner.score = game.finalScoreAwayTeam;
            loser.team = homeTeam;
            loser.score = game.finalScoreHomeTeam;

          } else if ( game.finalScoreAwayTeam < game.finalScoreHomeTeam ) {
            winner.team = homeTeam;
            winner.score = game.finalScoreHomeTeam;
            loser.team = awayTeam;
            loser.score = game.finalScoreAwayTeam;
          }

          calc.recordGameResults(winner, loser, ot, index);

          var formattedResult = game.finalScoreAwayTeam + "-" + game.finalScoreHomeTeam + " ";
          formattedResult += game.hadOT ? (game.hadSO ? 'SO' : 'OT') : '';
          progressGrid[homeTeam.id - 1][awayTeam.id - 1] = formattedResult;
        })


        angular.forEach(teams, function (team, index) {
          team.goalDifferential = team.goalsFor - team.goalsAgainst

          // var test = team.gamesPlayed === (team.wins + team.regulationLosses + team.overtimeShootoutLosses)
          // console.log(test, index, team);
        });

      },
      recordGameResults: function(winner, loser, ot, index) {
        console.log(ot);
        // track losses correctly
        if( ot.isOvertime ) {
          console.log('isOT');
          loser.team.overtimeShootoutLosses++
          loser.team.points++

        }
        if( ot.isShootout ) {
          console.log('isSO');
          winner.team.shootoutWins++
          loser.team.shootoutLosses++

          loser.team.points++

        } else {
           loser.team.regulationLosses++
        }

        //  update winner
        winner.team.wins++
        winner.team.points += 2
        winner.team.goalsFor += winner.score
        winner.team.goalsAgainst += loser.score
        winner.team.regulationOvertimeWins =  winner.team.wins - winner.team.shootoutWins
        winner.team.gamesPlayed = winner.team.wins + winner.team.regulationLosses + winner.team.overtimeShootoutLosses

        // update loser
        loser.team.goalsFor += loser.score
        loser.team.goalsAgainst += winner.score
        loser.team.regulationOvertimeLosses = loser.team.regulationOvertimeLosses - winner.team.shootoutLosses
        loser.team.gamesPlayed = loser.team.wins + loser.team.regulationLosses + loser.team.overtimeShootoutLosses
        console.log(loser, winner);
        console.log('****************************************');
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
