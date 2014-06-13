app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
}]);

app.controller('OldGamesController', ['$scope', 'games', function ($scope, games) {
    games.get.then(function (data) {
        $scope.games = data.filter(function (game) {
            return game.daysLeft <= -2;
        });
    });
}]);

app.controller('GamesController', ['$scope', 'games', function ($scope, games) {
    games.get.then(function (data) {
        $scope.games = data.filter(function (game) {
            console.log(game.bet.id, game.bet.isWin());
            return game.daysLeft > -2;
        });
    });
}]);


app.controller('GameController', ['$scope', '$http', '$routeParams', 'notification', '$rootScope', 'games',
    function ($scope, $http, $routeParams, notification, $rootScope, games) {
    var url = '/api/v1/games/' + $routeParams.id + '/bets';
    $http({
        method: 'GET',
        url: url
    }).success(function (data) {
        data.score_a = data.score_a || 0;
        data.score_b = data.score_b || 0;
        data.game = new Game(data.game);
        $scope.bet = new Bet(data);
        $rootScope.$emit('gameLoaded', {game: data.game});
    });

    $scope.submit = function (form) {
        $http({
            method: 'POST',
            url: url,
            data: {
                score_a: $scope.bet.score_a,
                score_b: $scope.bet.score_b
            }
        }).success(function (data) {
            games.updateBet(new Bet(data));
            notification.notify("Your bet has been saved.");
        });
    };
}]);


/* ************************************************************************* */
// Element Controllers

app.controller('UserController', ['$scope', 'user', '$http', function ($scope, user, $http) {
    user.then(function (u) {
        $scope.user = u;
    });
}]);

function sortScore(a, b) {
    return (a.score_a + a.score_b) - (b.score_a + b.score_b);
}

app.controller('BetsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.$on('gameLoaded', function (evt, args) {
        var game = args.game;
        if (game.lock) {
            //var url = '/api/v1/games/' + game.id + '/bets?friends=' + window.friends.join(',');
            var url = '/api/v1/games/' + game.id + '/bets?all=true';
            $http({
                method: 'GET',
                url: url
            }).success(function (data) {
                data = data.map(function (d) {
                    return new Bet(d);
                });

                $scope.competitorA = data.filter(function (bet) {
                    return bet.score_a > bet.score_b;
                }).sort(sortScore);

                $scope.competitorB = data.filter(function (bet) {
                    return bet.score_a < bet.score_b;
                }).sort(sortScore);

                $scope.tie = data.filter(function (bet) {
                    return bet.score_a == bet.score_b;
                }).sort(sortScore);
            });
        }
    });
}]);

app.controller('NotificationController', ['$scope', 'notification', function ($scope, notification) {
    $scope.notifications = notification.get();
}]);

app.controller('ScoreController', ['$scope', 'scores', function ($scope, scores) {
    scores.then(function (scores) {
        console.log(scores);
    });
}]);

function formatLeaderboardUser(data) {
    var previous, rank = 0,
        users = data.map(function (user) {
            if (previous === undefined || user.points !== previous) {
                rank += 1;
                previous = user.points;
            }
            user.rank = rank;
            return user;
        });
    return users;
}

app.controller('LeaderboardController', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/v1/leaderboard').then(function (response) {
        var users = formatLeaderboardUser(response.data);
        $scope.users = users;
    });
}]);

window.friends = [];

app.controller('FriendsLeaderboardController', ['$scope', '$q', function ($scope, $q) {
    var deferred = $q.defer();
    window.fbReady.push(function () {
        FB.Event.subscribe('auth.statusChange', function (response) {
            if (response.status === 'connected') {
                FB.api('/1477567782456567/scores', function (response) {
                    window.friends = response.data.map(function (friend) {
                        return friend.user.id;
                    });

                    var data = response.data.map(function (score) {
                        var user = {
                            points: parseInt(score.score, 10),
                            link: 'https://www.facebook.com/profile.php?id=' + score.user.id,
                            name: score.user.name
                        };
                        return user;
                    });
                    deferred.resolve(formatLeaderboardUser(data));
                });
            }
        });
    });

    deferred.promise.then(function (response) {
        $scope.users = response;
    });
}]);
