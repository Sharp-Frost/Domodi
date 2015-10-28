'use strict';


//Module des services 


angular.module('DomodiApp.services', []).
  
factory('domodiAPIservice', function($http) {
    var domodiAPI = {};
    
    domodiAPI.getHello = function() {
    	return $http.get('http://localhost:8080/api', '' );	
    };
    
    return domodiAPI;
  });