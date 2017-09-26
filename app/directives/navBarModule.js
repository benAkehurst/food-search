(function() {

    'use strict';

    var navBarModule = angular.module("navBarModule", []);

    navBarModule.controller("NavBarController", function($http, $route, $scope, $rootScope, $location, $timeout) {

        $rootScope.loggedIn = false;

        var checkLoggedIn = function() {
            var sessionItems = getSessionStorageItems();
            // console.log(localItems,sessionItems);
            if (!sessionItems) {
                $rootScope.loggedIn = true;
            } else {
                $rootScope.loggedIn = false;
            }
        }

        $scope.loggedIn = false;
        var loggedIn = function() {
            var staus = getSessionStorageItems();
            if (status = true){
                $scope.loggedIn = true;
            }
            else{
               $scope.loggedIn = false; 
            }
        }

        $timeout(function() {
            loggedIn();
        }, 7000);

        checkLoggedIn();

        $scope.logout = function() {
            sessionStorage.clear();
            $location.path('/login');
        }

    });

    function getSessionStorageItems() {
        var sessionLoggedIn = sessionStorage.getItem("loggedIn");
        return sessionLoggedIn;
    }

})();