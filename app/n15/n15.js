var app = angular.module('n15App', []);

app.controller('n15Controller', function ($scope) {

    $scope.teams = [
       {id: 1, city: "Anaheim", teamName: "Anaheim Ducks", teammates: "Arsen/Mladen"},
       {id: 2, city: "Tampa", teamName: "Tampa Bay Lightning", teammates: "Sergei/Gabe"},
       {id: 3, city: "Chicago", teamName: "Chicago Blackhawks", teammates: "Chad/Vlad"},
       {id: 4, city: "Washington", teamName: "Washington Capitals", teammates: "Isaac/Mauro"},
       {id: 5, city: "Montreal", teamName: "Montreal Canadiens", teammates: "Will/Ben Y "},
       {id: 6, city: "St. Louis", teamName: "St. Louis Blues", teammates: "Vikas/Henry"},
       {id: 7, city: "Dallas", teamName: "Dallas Stars", teammates: "Ben C/Bernardo"}
    ];

    $scope.gameResults = [
       {id: 1, date: "07/07/2015", awayTeam: 3, homeTeam: 6, finalScoreAwayTeam: 1, finalScoreHomeTeam: 3, OT: false, SO: false},
       {id: 2, date: "07/07/2015", awayTeam: 6, homeTeam: 1, finalScoreAwayTeam: 3, finalScoreHomeTeam: 2, OT: true, SO: true},
       {id: 3, date: "07/07/2015", awayTeam: 2, homeTeam: 6, finalScoreAwayTeam: 1, finalScoreHomeTeam: 0, OT: false, SO: false},
       {id: 4, date: "07/07/2015", awayTeam: 5, homeTeam: 1, finalScoreAwayTeam: 1, finalScoreHomeTeam: 2, OT: true, SO: false},
       {id: 5, date: "07/08/2015", awayTeam: 7, homeTeam: 4, finalScoreAwayTeam: 0, finalScoreHomeTeam: 1, OT: false, SO: false},
       {id: 6, date: "07/08/2015", awayTeam: 1, homeTeam: 7, finalScoreAwayTeam: 2, finalScoreHomeTeam: 3, OT: false, SO: false},
       {id: 7, date: "07/09/2015", awayTeam: 2, homeTeam: 3, finalScoreAwayTeam: 1, finalScoreHomeTeam: 0, OT: false, SO: false},
       {id: 8, date: "07/09/2015", awayTeam: 2, homeTeam: 4, finalScoreAwayTeam: 1, finalScoreHomeTeam: 0, OT: false, SO: false},
       {id: 9, date: "07/09/2015", awayTeam: 4, homeTeam: 7, finalScoreAwayTeam: 0, finalScoreHomeTeam: 2, OT: false, SO: false},
       {id: 10, date: "07/09/2015", awayTeam: 7, homeTeam: 2, finalScoreAwayTeam: 2, finalScoreHomeTeam: 0, OT: false, SO: false},
       {id: 11, date: "07/10/2015", awayTeam: 5, homeTeam: 4, finalScoreAwayTeam: 3, finalScoreHomeTeam: 2, OT: true, SO: true}
    ];

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
            var homeTeam = teams[gameResult.homeTeam - 1];
            var awayTeam = teams[gameResult.awayTeam - 1];


            if(gameResult.finalScoreAwayTeam > gameResult.finalScoreHomeTeam) {
                RecordGameResults(awayTeam, gameResult.finalScoreAwayTeam, homeTeam, gameResult.finalScoreHomeTeam,
                    gameResult.OT, gameResult.SO);
            }
            else if (gameResult.finalScoreHomeTeam > gameResult.finalScoreAwayTeam) {
                RecordGameResults(homeTeam, gameResult.finalScoreHomeTeam, awayTeam, gameResult.finalScoreAwayTeam,
                    gameResult.OT, gameResult.SO);
            }

            progressGrid[homeTeam.id - 1][awayTeam.id - 1] = $scope.formattedGameResult(gameResult.finalScoreAwayTeam,
                gameResult.finalScoreHomeTeam, gameResult.OT, gameResult.SO);

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