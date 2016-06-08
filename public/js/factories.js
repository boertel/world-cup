app.factory('notification', ['$sce', function ($sce) {
    var notifications = [];

    function notify(message, type, keep) {
        type = type || 'success';
        notifications.push({
            message: $sce.trustAsHtml(message),
            type: type,
            keep: keep,
            jump: 0,
        });
    }

    function get() {
        return notifications;
    }

    function remove() {
        var notif = notifications.pop();
        if (notif && notif.keep && !notif.jump) {
            notifications.push(notif);
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

    function get(filters) {
        return $http.get('/api/v1/games').then(function (response) {
            var games = response.data.map(function (game) {
                game.bet = new Bet(game.bet);
                return new Game(game);
            });
            return games;
        });
    }

    function groupByDay(groups) {
        var group = [],
            periodsDict = {};

        return get().then(function (data) {
            data = data.filter(function(d) {
                return groups.indexOf(d.group.id) !== -1;
            });

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
        get().then(function (games) {
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


app.factory('facebook', ['$q', '$http', function($q, $http) {
    function ready(callback) {
        window.fbReady.push(function() {
            if (!FB.getUserID()) {
                FB.Event.subscribe('auth.statusChange', function (response) {
                    if (response.status === 'connected') {
                        callback();
                    }
                });
            } else {
                callback();
            }
        })
    }

    function api() {
        var args = Array.prototype.slice.call(arguments);
        ready(function() {
            return FB.api.apply(FB, args);
        });
    }

    function login() {
        var args = Array.prototype.slice.call(arguments);
        window.fbReady.push(function() {
            FB.login.apply(FB, args);
        });
    }

    function permissions(callback) {
        return api('/me/permissions', function(response) {
            var perms = {};
            response.data.forEach(function(permission) {
                perms[permission.permission] = permission.status;
            });
            callback && callback(perms);
        });
    }

    function askPermissions(permissions, callback) {
        login(function(response) {
            var output = [];
            var accessToken = response.authResponse.accessToken;
            var scopes = response.authResponse.grantedScopes;

            permissions.forEach(function(permission) {
                if (scopes.indexOf(permission) !== -1) {
                    output.push(permission);
                }
            });

            if (accessToken) {
                $http.post('/api/v1/social', {access_token: accessToken}).then(function() {
                    callback && callback(output);
                });
            }
        }, {scope: permissions.join(','), return_scopes: true});
    }

    return {
        'api': api,
        'login': login,
        'permissions': permissions,
        'askPermissions': askPermissions,
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
