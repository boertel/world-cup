app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
    $http({
        method: 'GET',
        url: '/api/v1/games'
    }).success(function (data) {
        $scope.games = data;
    })
}]);

app.controller('GameController', ['$scope', '$http', '$routeParams', 'notification', function ($scope, $http, $routeParams, notification) {
    var url = '/api/v1/games/' + $routeParams.id + '/bets';
    $http({
        method: 'GET',
        url: url
    }).success(function (data) {
        data.score_a = data.score_a || 0;
        data.score_b = data.score_b || 0;
        $scope.bet = data;
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

app.controller('NotificationController', ['$scope', 'notification', function ($scope, notification) {
    $scope.notifications = notification.get();
}]);

