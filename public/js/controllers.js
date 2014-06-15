app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
}]);

app.controller('GamesController', ['$scope', 'games', function ($scope, games) {
    $scope.showPast = function (period) {
        $('.game.period-' + period).toggleClass('past');
    };

    games.get.then(function (data) {
        var days = [],
            periodsDict = {};

        data.forEach(function (d) {
            periodsDict[d.day] = periodsDict[d.day] || [];
            periodsDict[d.day].push(d);
        });

        for (var key in periodsDict) {
            days.push({
                day: moment(key).toDate(),
                dayCss: key,
                games: periodsDict[key].sort(function (a, b) {
                    return a.moment.time.unix() - b.moment.time.unix();
                })
            });
        }

        $scope.days = days;
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

app.controller('UserController', ['$scope', 'user', '$http', '$location', function ($scope, user, $http, $location) {
    user.then(function (u) {
        $scope.user = u;
    });

    $scope.isActive = function (route) {
        return route === $location.path();
    };
}]);

function sortScoreA(a, b) {
    return (a.score_a * 2 + a.score_b) - (b.score_a * 2 + b.score_b);
}

function sortScoreB(a, b) {
    return (a.score_a + a.score_b * 2) - (b.score_a + b.score_b * 2);
}

function sortScoreTie(a, b) {
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
                }).sort(sortScoreA);

                $scope.competitorB = data.filter(function (bet) {
                    return bet.score_a < bet.score_b;
                }).sort(sortScoreB);

                $scope.tie = data.filter(function (bet) {
                    return bet.score_a == bet.score_b;
                }).sort(sortScoreTie);
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

app.controller('FriendsLeaderboardController', ['$scope', 'friends', 'user', function ($scope, friends, user) {
    $scope.waiting = true;
    friends.then(function (response) {
        $scope.waiting = false;
        user.then(function (u) {
            response = response.map(function (friend) {
                if (u.username === friend.username) {
                    friend.me = true;
                }
                return friend;
            });
            $scope.users = response;
        });
    });
}]);
