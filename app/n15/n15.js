var app = angular.module('n15App', []);

app.controller('n15Controller', function ($scope, $http) {

    $http.get('tournament.json')
            .success(function(res) {
                $scope.teams = res.teams;
                $scope.gameResults = res.gameResults;
                $scope.createInitProgressGrid();
                $scope.calculateStandings();
            })
            .error(function (data, status, headers, config) {
                console.log("error loading data");
            });

    $scope.progressGrid = [];

    $scope.calculateStandings = function() {
        var teams = $scope.teams;

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

        var gameResults = $scope.gameResults;
        var progressGrid = $scope.progressGrid;

        angular.forEach(gameResults, function(gameResult) {
            var homeTeam = teams[gameResult.homeTeamId - 1];
            var awayTeam = teams[gameResult.awayTeamId - 1];


            if(gameResult.finalScoreAwayTeam > gameResult.finalScoreHomeTeam) {
                RecordGameResults(awayTeam, gameResult.finalScoreAwayTeam, homeTeam, gameResult.finalScoreHomeTeam,
                    gameResult.hadOT, gameResult.hadSO);
            }
            else if (gameResult.finalScoreHomeTeam > gameResult.finalScoreAwayTeam) {
                RecordGameResults(homeTeam, gameResult.finalScoreHomeTeam, awayTeam, gameResult.finalScoreAwayTeam,
                    gameResult.hadOT, gameResult.hadSO);
            }

            progressGrid[homeTeam.id - 1][awayTeam.id - 1] = $scope.formattedGameResult(gameResult.finalScoreAwayTeam,
                gameResult.finalScoreHomeTeam, gameResult.hadOT, gameResult.hadSO);

            function RecordGameResults(winningTeam, winningTeamScore, losingTeam, losingTeamScore, isOvertime, isShootout) {

                winningTeam.wins++;
                winningTeam.points += 2;

                if(isShootout) {
                    //losing team lost in shootout
                    winningTeam.shootoutWins++;
                    losingTeam.shootoutLosses++;
                    losingTeam.overtimeShootoutLosses++;
                    losingTeam.points += 1;
                }
                else if(isOvertime) {
                    //losing team lost in overtime
                    losingTeam.overtimeShootoutLosses++;
                    losingTeam.points += 1;
                }
                else {
                    //losing team lost in regulation
                    losingTeam.regulationLosses++;
                }

                winningTeam.gamesPlayed++;
                winningTeam.goalsFor += winningTeamScore;
                winningTeam.goalsAgainst += losingTeamScore;
                winningTeam.goalDifferential = winningTeam.goalsFor - winningTeam.goalsAgainst;

                losingTeam.gamesPlayed++;
                losingTeam.goalsFor += losingTeamScore;
                losingTeam.goalsAgainst += winningTeamScore;
                losingTeam.goalDifferential = losingTeam.goalsFor - losingTeam.goalsAgainst;

                winningTeam.regulationOvertimeWins = winningTeam.wins - winningTeam.shootoutWins;
                losingTeam.regulationOvertimeWins = losingTeam.wins - losingTeam.shootoutWins;

            }

        });
    };

    $scope.formattedGameResult = function(awayTeamScore, homeTeamScore, isOvertime, isShootout) {

        var ot_so = "";

        if(isShootout) {
            ot_so = 'SO';
        }
        else if(isOvertime) {
            ot_so = 'OT';
        }

        var formattedResult = awayTeamScore + " - " + homeTeamScore + " " + ot_so;

        return formattedResult;
    };

    $scope.awayTeamWon = function(awayTeamScore, homeTeamScore) {
        return awayTeamScore > homeTeamScore;
    }

    $scope.homeTeamWon = function(awayTeamScore, homeTeamScore) {
        return awayTeamScore < homeTeamScore;
    }

    $scope.createInitProgressGrid = function()
    {
        var numberOfTeams = $scope.teams.length;
        var grid = $scope.progressGrid;

        grid = new Array(numberOfTeams);

        for(var i = 0; i < grid.length; i++) {
            grid[i] = new Array(numberOfTeams);
            for(var j = 0; j < grid[i].length; j++) {
                grid[i][j] = "";
            }
        }
        $scope.progressGrid = grid;
    }

    $scope.showProgress = function(awayTeam, homeTeam) {
        var progressGrid = $scope.progressGrid;
        return progressGrid[awayTeam - 1][homeTeam - 1];
    }

});