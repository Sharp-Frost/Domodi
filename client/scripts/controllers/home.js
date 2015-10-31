'use strict';

/**
 * @ngdoc function
 * @name Domodi.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the Home page of Domodi
 */
angular.module('DomodiApp').controller('HomeCtrl', function ($scope, domodiAPIservice) {
    $scope.profileModel = {selected: ""};


    // Retrieve Hello message
    domodiAPIservice.getHello().then(function successCallback(response) {
        $scope.nodeHello = response.data.message;
    }, function errorCallback(response) {
        $scope.nodeHello = "An error occured while getting alive message : " + response;
    });

    // Retrieve devices list
    domodiAPIservice.getDevices().then(function successCallback(response) {
        $scope.devices = response.data;
    }, function errorCallback(response) {
        $scope.errors = "An error occured while getting devices : " + response;
    });

    // Retrieve profiles
    domodiAPIservice.getProfiles().then(function successCallback(response) {
        $scope.profiles = response.data;

        //select active profile in radio buttons
        $scope.profiles.forEach(function (profile) {
            if(profile.active) {
                $scope.profileModel.selected = profile._id;
                console.log("Selected profile is " + profile.name);
            }
        });


    }, function errorCallback(response) {
        $scope.errors = "An error occured while getting profiles : " + response;
    });


    // Handlers
    // =====================================================================

    $scope.changeProfile = function () {
        domodiAPIservice.activateProfile($scope.profileModel.selected).then(function successCallback(response) {
            console.log("Profile changed to " + $scope.profileModel.selected);

            //TODO : Notify the delay of profile changing to user

        }, function errorCallback(response) {
            $scope.errors = "An error occured while getting profiles : " + response;
        })
    };


});