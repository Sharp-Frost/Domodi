'use strict';

/**
 *
 */
angular.module('DomodiApp')
    .controller('ProfilesSettingsCtrl', function ($scope, domodiAPIservice) {
        // VARIABLES
        // =====================================================================

        $scope.daysOfweek = {
            selected: null,
            availableOptions: [
                {id: '0', name: 'Days'},
                {id: '1', name: 'Monday'},
                {id: '2', name: 'Tuesday'},
                {id: '3', name: 'Wednesday'},
                {id: '4', name: 'Thursday'},
                {id: '5', name: 'Friday'},
                {id: '6', name: 'Saturday'},
                {id: '7', name: 'Sunday'},
            ],
        };


        // INIT
        // ======================================================================
        // Retrieve profiles
        domodiAPIservice.getProfiles().then(function successCallback(response) {
            console.log(response.data);
            $scope.profiles = response.data;
            $scope.originalProfiles = angular.copy(response.data);
        }, function errorCallback(response) {
            $scope.errors = "An error occured while getting profiles : " + response;
        });


        // FUNCTIONS
        // ========================================================================
        // Return delay from milliSeconds to seconds
        $scope.getDelaySeconds = function (delay) {
            return delay / 1000
        };

        // Add a schedule to a profile
        $scope.addSchedule = function (profile, day, time) {
            console.log('Day '+ day + ' time ' + time);
            if(profile.planning === undefined) {
                profile.planning = new Array();
            }
            profile.planning.push({day:day, time:time});

            console.log("hash as object" + $scope.daysOfweek.availableOptions[5].name);
        }
    });