app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/v1/games'
    }).success(function (data) {
        $scope.games = data;
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

var friends = ['1', '3', '4'];

/* ************************************************************************* */
// Element Controllers

app.controller('BetsController', ['$scope', '$http', '$rootScope', function ($scope, $http, $rootScope) {
    $rootScope.$on('gameLoaded', function (evt, args) {
        var game = args.game;
        if (game.lock) {
            var url = '/api/v1/games/' + game.id + '/bets?friends=' + friends.join(',');
            $http({
                method: 'GET',
                url: url
            }).success(function (data) {
                $scope.bets = data;
            });
        }
    });
}]);

app.controller('NotificationController', ['$scope', 'notification', function ($scope, notification) {
    $scope.notifications = notification.get();
}]);

app.controller('LeaderboardController', ['$scope', 'scores', function ($scope, scores) {
    scores.then(function (bets) {
        console.log(bets);
    });
}]);
