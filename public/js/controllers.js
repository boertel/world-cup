app.controller('HomeController', ['$scope', 'notification', function ($scope, notification) {
    $scope.scope = '1,2,3,4,5,6';
}]);

app.controller('GamesController', ['$scope', 'games', '$location', '$anchorScroll', '$timeout', function ($scope, games, $location, $anchorScroll, $timeout) {
    $scope.showPast = function (period) {
        $('.game.period-' + period).toggleClass('past');
    };

    var groups = $scope.$parent.scope.split(',').map(function(g) { return parseInt(g, 10) });
    games.groupByDay(groups).then(function (data) {
        $scope.days = data
        $timeout(function () {
            $location.hash() && $anchorScroll();
        });
    });
}]);

app.controller('CompetitorController', ['$scope', '$http', '$routeParams',
   function ($scope, $http, $routeParams) {
        $http({
            method: 'GET',
            url: '/api/v1/competitors/' + $routeParams.id + '/games',
        }).success(function (data) {
            var games = data.map(function (game) {
                game.bet = new Bet(game.bet);
                return new Game(game);
            });
            $scope.games = games;

            $scope.competitor = games[0].competitorA.id == $routeParams.id ? games[0].competitorA : games[0].competitorB;
            var name = $scope.competitor.name;
            $scope.competitor.possessive = name[name.length - 1] === 's' ? name + "'" : name + "'s";
        });
   }
]);

app.controller('GameController', ['$scope', '$http', '$routeParams', 'notification', '$rootScope', 'games', '$location', '$window',
    function ($scope, $http, $routeParams, notification, $rootScope, games, $location, $window) {
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

    function save(nextUrl) {
        $http({
            method: 'POST',
            url: url,
            data: {
                score_a: $scope.bet.score_a,
                score_b: $scope.bet.score_b
            }
        }).success(function (data) {
            games.updateBet(new Bet(data));
            $location.url(nextUrl);
            notification.remove();
            notification.notify("Your bet has been saved.");
        })
    }

    $scope.submit = function () {
        save('/#game-' + $scope.bet.game.id);
    };

    $scope.submitAndNext = function() {
        save('/games/' + $scope.bet.game.next);
    };

    $scope.next = function() {
        $location.url('/games/' + $scope.bet.game.next);
    };

    $scope.back = function () {
        $window.history.back();
    };
}]);


app.controller('ProfileController', ['$scope', '$http', '$routeParams', 'user', function ($scope, $http, $routeParams, user) {
    $scope.game = false;
    $scope.number = {
        perfect: 0,
        win: 0,
        lost: 0
    };

    $scope.showGame = function (bet) {
        var bet = bet,
            game = new Game(bet.game);
        game.bet = bet;
        $scope.game = game;
    };

    $http({
        method: 'GET',
        url: '/api/v1/users/' + $routeParams.id + '/bets',
    }).success(function (data) {
        $scope.bets = data.map(function (d) {
            var bet = new Bet(d);
            bet.game = new Game(bet.game);
            $scope.number[bet.type()] += 1;
            return bet;
        }).sort(function (a, b) {
            return a.game.moment.time.unix() - b.game.moment.time.unix();
        });
    });

    user.get($routeParams.id).then(function (user) {
        $scope.user = user;
    });
}]);


/* ************************************************************************* */
// Element Controllers

app.controller('UserController', ['$scope', 'user', '$http', '$location', function ($scope, user, $http, $location) {
    user.get('me').then(function (u) {
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

app.controller('BetsController', ['$scope', '$http', '$rootScope', 'friends', function ($scope, $http, $rootScope, friends) {
    $scope.scope = 'all';
    $rootScope.$on('gameLoaded', function (evt, args) {
        var game = args.game;
        if (game.lock) {
            var url = '/api/v1/games/' + game.id + '/bets?all=true';
            $http({
                method: 'GET',
                url: url
            }).success(function (data) {
                friends.then(function (friendslist) {
                    var friendslist = friendslist.map(function (f) {
                        return f.username;
                    });
                    data = data.map(function (d) {
                        if (friendslist.indexOf(d.User.username) !== -1) {
                            d.friend = true;
                        }
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
    var previous, rank = 0, i = 1,
        users = data.map(function (user) {
            if (previous === undefined || user.points !== previous) {
                rank = i;
                previous = user.points;
            }
            user.rank = rank;
            i += 1;
            return user;
        });
    return users;
}

app.controller('LeaderboardController', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/v1/leaderboard').then(function (response) {
        var users = formatLeaderboardUser(response.data);
        users.forEach(function (user) {
            user.link = '#/user/' + user.id;
        });
        $scope.users = users;
    });
}]);

app.controller('FriendsLeaderboardController', ['$scope', 'friends', 'user', function ($scope, friends, user) {
    $scope.waiting = true;
    friends.then(function (response) {
        $scope.waiting = false;
        user.get('me').then(function (u) {
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
