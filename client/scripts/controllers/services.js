'use strict';


//Module des services 


angular.module('DomodiApp.services', []).
  
factory('configAPIservice', function($http) {
    var configAPI = {};
    
    //configAPI.getSocles = function() {
    //	return $http.post('http://localhost/~Simon/GigondasDNA/cgi-bin/configDNA.cgi', '{"action": "getSocle"}' );	
    //};
    
    return configAPI;
  });