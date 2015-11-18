'use strict';

/**
 * @ngdoc function
 * @name Domodi.controller:HomeCtrl
 * @description
 * # HomeCtrl
 * Controller of the Home page of Domodi
 */
angular.module('DomodiApp').controller('HomeCtrl', function ($scope, domodiAPIservice) {

    // VARIABLES
    // =====================================================================
    $scope.profileModel = {selected: ""};
    $scope.datetime = "date";
    $scope.serverAlerts = [];
    $scope.alertsItemPerPage =  5;
    $scope.alertsCurrentPage = 1;





    // INIT
    // ======================================================================
    // Retrieve Hello message
    domodiAPIservice.getHello().then(function successCallback(response) {
        $scope.nodeHello = response.data.message;
    }, function errorCallback(response) {
        $scope.nodeHello = "An error occured while getting alive message : " + response;
    });


    //Retrieve alerts
    domodiAPIservice.getAlerts().then(function successCallback(response) {
       $scope.serverAlerts = response.data;
    }, function errorCallback(response) {
        $scope.alerts.push({
            type: 'danger',
            msg: 'Unable to get alerts'
        });
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
            if (profile.active) {
                $scope.profileModel.selected = profile._id;
                console.log("Selected profile is " + profile.name);
            }
        });
    }, function errorCallback(response) {
        $scope.errors = "An error occured while getting profiles : " + response;
    });

    // Websocket Handlers
    // =====================================================================
    // Connection socket io
    var socket = io.connect('localhost:8080');

    socket.on('profile.updated', function (profile) {
        //Change active profile if needed
        if (profile.active) {
            $scope.profileModel.selected = profile._id;
            console.log("Selected profile is " + profile.name);
            $scope.$apply(); // AngularJS need to be manually called to refresh the view
        }
    });

    socket.on('alerts.updated', function (alerts) {
        //Change active profile if needed
        $scope.serverAlerts = angular.copy(alerts);
        $scope.$apply(); // AngularJS need to be manually called to refresh the view
    });



    // Functions
    // =====================================================================

    $scope.changeProfile = function () {
        $("#profileSpinner").show(); //Show the spinner during action

        domodiAPIservice.activateProfile($scope.profileModel.selected).then(function successCallback(response) {
            console.log("Profile changed to " + $scope.profileModel.selected);
            $("#profileSpinner").hide(); //Hide the spinner during action

        }, function errorCallback(response) {
            $("#profileSpinner").hide(); //Hide the spinner during action
            $scope.errors = "An error occured while getting profiles : " + response;
        })
    };

    $scope.closeAlert = function (index) {
        var alertToClose = $scope.serverAlerts[index];
        domodiAPIservice.deleteAlert(alertToClose._id).then(function successCallback(response) {
            $scope.serverAlerts.splice(index, 1);
        }, function errorCallback(response) {

        });
    };

    $scope.formatDate = function(date) {
        return moment(date).format('Do MMMM  HH:mm ');
    }


    //Alerts pagination
    $scope.setPage = function (pageNo) {
        $scope.alertsCurrentPage = pageNo;
    };

    $scope.closeAllAlerts = function() {
        domodiAPIservice.deleteAllAlert().then(function successCallback(response) {
            $scope.serverAlerts=[];
        }, function errorCallback(response) {

        });
    }



});