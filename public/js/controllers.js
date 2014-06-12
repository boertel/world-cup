app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/v1/games'
    }).success(function (data) {
        $scope.games = data.map(function (game) {
            return new Game(game);
        });
    })
}]);


app.controller('GameController', ['$scope', '$http', '$routeParams', 'notification', '$rootScope',
    function ($scope, $http, $routeParams, notification, $rootScope) {
    var url = '/api/v1/games/' + $routeParams.id + '/bets';
    $http({
        method: 'GET',
        url: url
    }).success(function (data) {
        data.score_a = data.score_a || 0;
        data.score_b = data.score_b || 0;
        data.game = new Game(data.game);
        $scope.bet = data;
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
            notification.notify("Your bet has been saved.")
        });
    };
}]);


/* ************************************************************************* */
// Element Controllers

app.controller('UserController', ['$scope', 'user', '$http', function ($scope, user, $http) {
    user.then(function (u) {
        $scope.user = u;
    });

    $http({
        url: '/api/v1/users/me/points',
        method: 'POST'
    }).success(function (response) {
    });

}]);

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
                $scope.competitorA = data.filter(function (bet) {
                    return bet.score_a > bet.score_b;
                });

                $scope.competitorB = data.filter(function (bet) {
                    return bet.score_a < bet.score_b;
                });

                $scope.tie = data.filter(function (bet) {
                    return bet.score_a == bet.score_b;
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

app.controller('LeaderboardController', ['$scope', '$http', function ($scope, $http) {
    $http.get('/api/v1/leaderboard').then(function (response) {
        var users = response.data;
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
                    deferred.resolve(response.data);
                })
            }
        });
    });

    deferred.promise.then(function (response) {
        $scope.users = response;
    });
}]);
