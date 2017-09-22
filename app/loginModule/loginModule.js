(function() {

    'use strict';

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location) {

    	$scope.login = function(email,password){
    		console.log(email + "," + password);
    	}

    	$scope.signUp = function(name,email,password){
    		console.log(name + "," + email + "," + password);
    	}

    	$scope.redirectToRoutes = function(){
    		$location.path('/routes');
    	}

    });

})();