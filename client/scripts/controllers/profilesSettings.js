'use strict';

/**
 *
 */
angular.module('DomodiApp')
    .directive('clockpicker', ['$timeout', '$parse', function ($timeout, $parse) {
        return {
            restrict: 'C',
            require: 'ngModel',
            link: function link(scope, elm, attrs, ngModel) {
                var inputElm = $('input', elm);
                var modelGetter = $parse(attrs['ngModel']);
                var modelSetter = modelGetter.assign;
                function afterUpdate() {
                    return $timeout(function () {
                        var value = modelGetter(scope);
                        if (value) {
                            value = moment(value);
                        }
                        var inputVal = moment(inputElm.val(), 'HH:mm');
                        if (inputVal.isValid()) {
                            if (!value) {
                                modelSetter(scope, inputVal.toDate());
                            } else {
                                value.hour(inputVal.hour());
                                value.minute(inputVal.minute());

                                modelSetter(scope, value.toDate());

                                scope.$digest();
                            }
                        }
                    })
                }
                elm.clockpicker({
                    donetext: 'Done',
                    autoclose: true,
                    afterDone: afterUpdate
                });
                inputElm.blur(afterUpdate);
                ngModel.$formatters.push(function (value) {
                    if (value) {
                        inputElm.val(moment(value).format('HH:mm'));
                    }
                    return value;
                });
            }
        }
    }])




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
        $('.clockpicker').clockpicker();

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