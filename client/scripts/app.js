'use strict';

angular
    .module('DomodiApp', [
        'ui.bootstrap',
        'DomodiApp.services',
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch'
    ])

    .config(function ($routeProvider) {
        $routeProvider

            .when('/', {
                templateUrl: 'views/home.html',
                controller: 'HomeCtrl'
            })
            .when('/profilesSettings', {
                templateUrl: 'views/profilesSettings.html',
                controller: 'ProfilesSettingsCtrl'
            })
            .when('/notificationsSettings', {
                templateUrl: 'views/notificationsSettings.html',
                controller: 'NotificationsSettingsCtrl'
            })

            .otherwise({
                redirectTo: '/'
            });
    });
