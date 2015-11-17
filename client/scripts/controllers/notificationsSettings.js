angular.module('DomodiApp')

    .directive('toggleCheckbox', ['$timeout', function ($timeout) {

        /**
         * Directive
         */
        return {
            restrict: 'A',
            transclude: true,
            replace: false,
            require: 'ngModel',
            link: function ($scope, $element, $attr, ngModel) {

                // update model from Element
                var updateModelFromElement = function () {
                    // If modified
                    var checked = $element.prop('checked');
                    if (checked != ngModel.$viewValue) {
                        // Update ngModel
                        ngModel.$setViewValue(checked);
                        $scope.$apply();
                    }
                };

                // Update input from Model
                var updateElementFromModel = function (newValue) {
                    $element.trigger('change');
                };

                // Observe: Element changes affect Model
                $element.on('change', function () {
                    updateModelFromElement();
                });

                $scope.$watch(function () {
                    return ngModel.$viewValue;
                }, function (newValue) {
                    updateElementFromModel(newValue);
                }, true);

                // Initialise BootstrapToggle
                $element.bootstrapToggle();
            }
        };
    }]
)


    .controller('NotificationsSettingsCtrl', function ($scope, domodiAPIservice) {

        // VARIABLES
        // =====================================================================
        $scope.originalNotifiers;
        $scope.pushbullet = {name: 'pushbullet', apiKey: '', err: '', active: false};
        $scope.notifiers = [];
        $scope.alerts = []; // Push error like : {type: 'danger', msg: 'An error occured while saving modifications', timeout: 5000}


        // INIT
        // ======================================================================
        // Retrieve notifiers
        domodiAPIservice.getNotifiers().then(function successCallback(response) {
            $scope.originalNotifiers = angular.copy(response.data);

            var pushBulletIndex = arrayObjectIndexOf(response.data, "pushbullet", "name");
            console.log('Index of pushbullet data : ' + pushBulletIndex);

            if (pushBulletIndex != -1) {
                $scope.pushbullet = angular.copy(response.data[pushBulletIndex])
                console.log('pushbullet is now : ' + $scope.pushbullet);
            }

        }, function errorCallback(response) {
            $scope.alerts.push({
                type: 'danger',
                msg: 'An error occured while getting data' ,
                timeout: 5000
            });
        });


        // FUNCTIONS
        // ========================================================================
        //Save modifications
        $scope.save = function () {
            //TODO : implement save witch check before ?
            $scope.notifiers.push($scope.pushbullet);
            domodiAPIservice.updateNotifiers($scope.notifiers).then(function successCallback(response) {
                $scope.originalNotifiers = angular.copy(response.data);
                $scope.alerts.push({type: 'success', msg: 'Modifications saved', timeout: 5000});
                //TODO : notify user of success
            }, function errorCallback(response) {
                //TODO : notify user of error
                $scope.alerts.push({type: 'danger', msg: 'An error occured while saving modifications', timeout: 5000});
            });
        }

        //Cancel modifications
        $scope.cancel = function () {
            //TODO : restore default values
            var pushBulletIndex = arrayObjectIndexOf($scope.originalNotifiers, "pushbullet", "name");
            $scope.pushbullet = angular.copy($scope.originalNotifiers[pushBulletIndex]);
        }

        // Test apiKey
        $scope.testPushBullet = function (apiKey) {
            $scope.pushbullet.err = '';
            domodiAPIservice.testPushBullet({apiKey: apiKey}).then(function successCallback(response) {
                $scope.alerts.push({type: 'success', msg: 'PushBullet tested successfully', timeout: 5000});
            }, function errorCallback(response) {
                $scope.pushbullet.err = response.data.message;
                $scope.alerts.push({
                    type: 'danger',
                    msg: 'PushBullet test error : ' + response.data.message,
                    timeout: 5000
                });
            });
        }

        $scope.closeAlert = function (index) {
            $scope.alerts.splice(index, 1);
        };

    });


function arrayObjectIndexOf(myArray, searchTerm, property) {
    for (var i = 0, len = myArray.length; i < len; i++) {
        if (myArray[i][property] === searchTerm) return i;
    }
    return -1;
}



