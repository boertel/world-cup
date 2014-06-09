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
            })
    }]).run(function ($rootScope, $route, $window, $location, notification) {
        $rootScope.$on('$routeChangeError', function (e, curr, prev) {
        });

        $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
        });

        $rootScope.$on('$routeChangeSuccess', function (e, curr, prev) {
            notification.remove()
        });
    });
