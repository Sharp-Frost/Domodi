'use strict';

/**
 * @ngdoc function
 * @name Domodi.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the Home page of Domodi
 */
angular.module('DomodiApp').controller('HomeCtrl', function ($scope, domodiAPIservice) {
    $scope.profileModel= {radio : ""};

    domodiAPIservice.getHello().then(function successCallback(response) {
    	$scope.nodeHello = response.data.message;
    }, function errorCallback(response) {
    	$scope.nodeHello = "An error occured while getting alive message : " + response;
    });


    domodiAPIservice.getDevices().then(function successCallback(response) {
    	$scope.devices = response.data;
    }, function errorCallback(response) {
    	$scope.errors = "An error occured while getting devices : " + response;
    });


    domodiAPIservice.getProfiles().then(function successCallback(response) {
        $scope.profiles = response.data;
    }, function errorCallback(response) {
        $scope.errors = "An error occured while getting profiles : " + response;
    });


  });