'use strict';

/**
 * @ngdoc overview
 * @name gigondasDnav2App
 * @description
 * # gigondasDnav2App
 *
 * Main module of the application.
 */
angular
  .module('DomodiApp', [
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
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })     
      .when('/settings', {
        templateUrl: 'views/settings.html',
        controller: 'SettingsCtrl'
      }) 
      .otherwise({
        redirectTo: '/'
      });
  });
