'use strict';

/**
 *
 */
angular.module('DomodiApp')

    //TODO : See if directives can be exported in another file to be reused everywhere else
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
            ]
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
            if ((undefined != day) && (undefined != time) && (time instanceof Date))
            {
                if (profile.planning === undefined) {
                    profile.planning = new Array();
                }
                //Special case for every days
                if (day == 0) {
                    for (var i = 1; i <= 7; i++) {
                        profile.planning.push({day: i, hours: time.getHours(), minutes: time.getMinutes()});
                    }
                } else {
                    profile.planning.push({day: Number(day), hours: time.getHours(), minutes: time.getMinutes()});
                }
            }
        }

        //Save modifications
        $scope.save = function () {
            domodiAPIservice.updateProfiles($scope.profiles).
                then(function successCallback(response) {
                    console.log("profiles saved");
                    $scope.originalProfiles = angular.copy(response.data);
                }, function errorCallback(response) {
                    console.log("An error occured while getting profiles : " + response);
                });
        }

        //Cancel modifications
        $scope.cancel = function () {
            $scope.profiles = angular.copy($scope.originalProfiles);
        }

        //Return a string with leading 0 for int
        $scope.zeroPadding = function (value) {
            var n = value.toString();
            if (n.length < 2) n = '0'+n;
            return n
        }

    });