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

        return domodiAPI;
    });