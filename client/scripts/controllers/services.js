'use strict';


//Module des services 


angular.module('DomodiApp.services', []).

    factory('domodiAPIservice', function ($http) {
        var domodiAPI = {};
        var host = 'http://localhost:8080/domodi';

        domodiAPI.getHello = function () {
            return $http.get(host + '/', '');
        };

        domodiAPI.getDevices = function () {
            return $http.get(host + '/devices', '');
        };

        domodiAPI.getProfiles = function () {
            return $http.get(host + '/profiles', '');
        };

        domodiAPI.activateProfile = function (id) {
          return $http.post(host + '/profiles/' + id + '/activate' );
        };

        domodiAPI.updateProfiles = function (profiles) {
            return $http.put(host + '/profiles/', profiles );
        }

        domodiAPI.testPushBullet = function (apiKey) {
            return $http.post(host + '/notifications/pushbullet/test',apiKey );
        }

        /** Notification **/
        domodiAPI.updateNotifiers = function(notifiers) {
            return $http.put(host + '/notifications/', notifiers );
        }

        domodiAPI.getNotifiers = function() {
            return $http.get(host + '/notifications', '');
        }

        domodiAPI.getAlerts = function() {
            return $http.get(host + '/alerts', '');
        }

        domodiAPI.deleteAlert = function(id) {
            return $http.delete(host + '/alerts/' + id);
        }

        domodiAPI.deleteAllAlert = function() {
            return $http.delete(host + '/alerts/');
        }

        return domodiAPI;
    });