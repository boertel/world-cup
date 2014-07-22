app.factory('notification', ['$sce', function ($sce) {
    var notifications = [];

    function notify(message, type, jump) {
        type = type || 'success';
        notifications.push({
            message: $sce.trustAsHtml(message),
            type: type,
            jump: jump || 0
        });
    }

    function get() {
        return notifications;
    }

    function remove() {
        var notif = notifications.pop();
        if (notif) {
            if (notif.jump === 0) {
                notifications.push(notif);
            }
            notif.jump += 1;
        }
    }

    return {
        notify: notify,
        get: get,
        remove: remove
    };
}]);

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
    var url = '/api/v1/users/',
        users = {};

    function get(id) {
        if (users[id] === undefined) {
            users[id] = $http.get(url + id).then(function (response) {
                return response.data;
            });
        }
        return users[id];
    }

    return {
        get: get
    };
}]);

app.factory('games', ['$http', function ($http) {
    var promise = $http.get('/api/v1/games').then(function (response) {
        var games = response.data.map(function (game) {
            game.bet = new Bet(game.bet);
            return new Game(game);
        });
        return games;
    });

    function get(filters) {
        return promise
    }

    function groupByDay() {
        var group = [],
            periodsDict = {};

        return promise.then(function (data) {
            data.forEach(function (d) {
                periodsDict[d.day] = periodsDict[d.day] || [];
                periodsDict[d.day].push(d);
            });

            for (var key in periodsDict) {
                var day = {
                    day: moment(key).toDate(),
                    dayCss: key,
                    games: periodsDict[key].sort(function (a, b) {
                        return a.moment.time.unix() - b.moment.time.unix();
                    }),
                    past: moment(key).diff(new Date(), 'day') <= -2
                };
                group.push(day);
            }

            return group;
        });
    }

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
        get: get,
        updateBet: updateBet,
        groupByDay: groupByDay
    }
}]);


app.factory('friends', ['$q', function ($q) {
    var deferred = $q.defer();
    function getScores () {
        FB.api('/1477567782456567/scores', function (response) {
            var data = response.data.map(function (score) {
                var user = {
                    points: parseInt(score.score, 10),
                    link: 'https://www.facebook.com/profile.php?id=' + score.user.id,
                    name: score.user.name,
                    username: score.user.id,
                    id: 'fb_' + score.user.id
                };
                return user;
            });
            deferred.resolve(formatLeaderboardUser(data));
        });
    }
    window.fbReady.push(function () {
        if (!FB.getUserID()) {
            FB.Event.subscribe('auth.statusChange', function (response) {
                if (response.status === 'connected') {
                    getScores();
                }
            });
        } else {
            getScores();
        }
    });

    return deferred.promise;
}]);

app.factory('leaderboard', ['$http', function ($http) {
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

    var promise = $http.get('/api/v1/leaderboard').then(function (response) {
        var users = formatLeaderboardUser(response.data);
        users.forEach(function (user) {
            user.link = '#/user/' + user.id;
        });
        return users;
    });

    return promise;
}]);
