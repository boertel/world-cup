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

    return {
        notify: notify,
        get: get
    }
});

app.factory('scores', ['$http', function ($http) {
    var url = '/api/v1/bets';
    var promise = $http({
        method: 'PUT',
        url: url
    }).then(function (bets) {
        return bets;
    });

    return promise;
}]);
