app.factory('notification', function () {
    var notifications = [];

    function notify(message, type) {
        type = type || 'success';
        notifications.push({
            message: message,
            type: type
        });
    }

    function get() {
        return notifications;
    }

    function remove() {
        return notifications.pop();
    }

    return {
        notify: notify,
        get: get,
        remove: remove
    };
});

app.factory('scores', ['$http', function ($http) {
    var url = '/api/v1/bets';
    var promise = $http({
        method: 'PUT',
        url: url
    }).then(function (response) {
        return response.data;
    });

    return promise;
}]);

app.factory('user', ['$http', function ($http) {
    var promise = $http.get('/api/v1/users/me').then(function (response) {
        return response.data;
    });
    return promise;
}]);

app.factory('games', ['$http', function ($http) {
    var promise = $http.get('/api/v1/games').then(function (response) {
        var games = response.data.map(function (game) {
            game.bet = new Bet(game.bet);
            return new Game(game);
        });
        return games;
    });

    function updateBet(bet) {
        promise.then(function (games) {
            games.forEach(function (game) {
                if (game.id === bet.game_id) {
                    game.bet = game.bet || new Bet({});
                    angular.extend(game.bet, bet);
                }
            });
        });
    }

    return {
        get: promise,
        updateBet: updateBet
    }
}]);


app.factory('friends', ['$q', function ($q) {
    var deferred = $q.defer();
    window.fbReady.push(function () {
        FB.Event.subscribe('auth.statusChange', function (response) {
            if (response.status === 'connected') {
                FB.api('/1477567782456567/scores', function (response) {
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

    return deferred.promise;
}]);
