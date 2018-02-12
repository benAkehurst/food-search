(function() {

    'use strict';

    var navBarModule = angular.module("navBarModule", []);

    navBarModule.controller("NavBarController", function($http, $route, $scope, $rootScope, $location, $timeout) {

        $rootScope.loggedIn = false;

        const checkLoggedIn = function() {
            let userToken = getLocalStorageItems();
            // console.log(localItems,sessionItems);
            if (!userToken.token) {
                $rootScope.loggedIn = false;
            } else {
                $rootScope.loggedIn = true;
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
            localStorage.clear();
            $location.path('/login');
        }

    });

    function getLocalStorageItems() {
        let userToken = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        let userObj = {
            token: userToken,
            userId: userId
        };
        return userObj;
    }

})();