(function() {

    'use strict';

    var navBarModule = angular.module("navBarModule", []);

    navBarModule.controller("NavBarController", function($http, $route, $scope, $rootScope, $location, $timeout) {

    	$scope.showMe = false;
    	$scope.showMeTest = function(){
    		$scope.showMe = true;
    	}

        var checkLoggedIn = function(){
        	var localItems = getLocalStorageItems();
        	var sessionItems = getSessionStorageItems();
        	console.log(localItems,sessionItems);
        	$scope.userEmail = localItems.email;
        }

        checkLoggedIn();

    });

    function getLocalStorageItems(){
        var localStayLoggedIn = localStorage.getItem("stayLoggedIn");
        var localEmail = localStorage.getItem("email");
        var localData = {
        	stayLoggedIn: localStayLoggedIn,
        	email: localEmail
        }
        return localData;
    }

    function getSessionStorageItems(){
    	var sessionLoggedIn = sessionStorage.getItem("loggedIn");
    	return sessionLoggedIn;
    }

})();