angular.module('DomodiApp')
    .controller('NotificationsSettingsCtrl', function ($scope, domodiAPIservice) {

        // VARIABLES
        // =====================================================================
        $scope.originalPushbullet = {};

        $scope.pushbullet = {apiKey:'', err:''};



        // INIT
        // ======================================================================
        // Retrieve profiles
        //domodiAPIservice.getPushbulletSettings().then(function successCallback(response) {
        //
        //    $scope.pushbullet.apiKey = response.data;
        //    $scope.originalPushbullet = angular.copy(response.data);
        //}, function errorCallback(response) {
        //    $scope.errors = "An error occured while getting pushbullet settings : " + response;
        //});


        // FUNCTIONS
        // ========================================================================
        //Save modifications
        $scope.save = function () {
            //TODO : implement save witch check before ?
        }

        //Cancel modifications
        $scope.cancel = function () {
            //TODO : restore default values
        }

        // Test apiKey
        $scope.testPushBullet = function (apiKey) {
            $scope.pushbullet.err ='';
            domodiAPIservice.testPushBullet({ apiKey: apiKey}).then(function successCallback(response) {
                $scope.pushbullet.err = 'OK';
            }, function errorCallback(response) {
                $scope.pushbullet.err = response.data.message;
            });
        }

    });
