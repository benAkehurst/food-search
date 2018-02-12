(function() {

    'use strict';

    var navBarModule = angular.module("navBarModule", []);

    navBarModule.controller("NavBarController", function ($http, $route, $scope, $rootScope, $location, $timeout, $window, checkLoggedIn) {

       $scope.isLoggedIn = false;

        function whenReady() {
            if (checkLoggedIn.userStatus()) {
                $scope.isLoggedIn = true;
            }
            else {
                $scope.isLoggedIn = false;
                window.setTimeout(whenReady, 1000);
            }
        }
        window.setTimeout(whenReady, 1000);

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