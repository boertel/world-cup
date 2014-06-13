var app = angular.module('content', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'pages/home.html',
                controller: 'HomeController'
            })
            .when('/_=_', {
                templateUrl: 'pages/home.html',
                controller: 'HomeController'
            })
            .when('/games/:id', {
                templateUrl: 'pages/game.html',
                controller: 'GameController'
            });
    }]).run(function ($rootScope, $route, $window, $location, notification) {
        $rootScope.$on('$routeChangeError', function (e, curr, prev) {
        });

        $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
        });

        $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
            notification.remove();
        });
    });

function requestCallback(response) {
    console.log(response);
}

$(document).ready(function () {
    $(document.body).on('click', '.invite-friends', function () {
            FB.ui({
                method: 'apprequests',
                message: 'Bet on the World Cup 2014 and compete with your friends.'
            }, requestCallback);
    });

    function gotoHref() {
       var href = $(this).data('href');
        if (href) {
            document.location = href;
        }
    }

    $(document.body).on('click', '.game', gotoHref);
});
