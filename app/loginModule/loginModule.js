(function() {

    'use strict';

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location) {

        $scope.login = function(email, password) {
            console.log(email + "," + password);
        }

        $scope.signUp = function(email, password) {
        	console.log("signup Called");
            var data = {
                email: email,
                password: password
            };
            $http({
                method: "POST",
                url: '/registerUser',
                data: data
            }).then(function success(response) {
                console.log(response);
                sorting(options);
            }, function error(response) {
                console.log(response.statusText);
            });

        }

        $scope.redirectToRoutes = function() {
            $location.path('/routes');
        }

    });

})();