'use strict';

/**
 * @ngdoc function
 * @name gigondasDnav2App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the gigondasDnav2App
 */
angular.module('DomodiApp').controller('HomeCtrl', function ($scope, domodiAPIservice) {
    $scope.nodeHello = "Hello from NOT nodeJs"

    domodiAPIservice.getHello().then(function successCallback(response) {
    	$scope.nodeHello = response.data.message;
    }, function errorCallback(response) {
    	$scope.nodeHello = "An error occured " + response;
    });


    domodiAPIservice.getDevices().then(function successCallback(response) {
    	$scope.devices = response.data;
    }, function errorCallback(response) {
    	$scope.errors = "An error occured while getting devices : " + response;
    });


  });