(function() {

    'use strict';

    var isDlgOpen;

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location,$timeout) {

        $scope.signUpSuccess = false;

        $scope.login = function(email, password) {
        	console.log("Login")
            var data = {
                email: email,
                password: password
            };
            $http({
                method: "POST",
                url: '/login',
                data: data
            }).then(function success(response) {
            	console.log(response.data);
                // if (response.data === true) {
                //     console.log("loged in UP");
                //     $location.path('/routes');
                // }
            }, function error(response) {
                console.log(response.statusText);
            });
        }

        $scope.signUp = function(email, password) {
            // console.log("signup Called");
            var data = {
                email: email,
                password: password
            };
            $http({
                method: "POST",
                url: '/registerUser',
                data: data
            }).then(function success(response) {
                $scope.sign_up_form.$setPristine();
                if (response.data === true) {
                    console.log("Signed UP");
                    $scope.signUpSuccess = true;
                    $timeout(function() {
                        $scope.signUpSuccess = false;
                    }, 5000);
                }
            }, function error(response) {
                console.log(response.statusText);
            });

        }

        $scope.redirectToRoutes = function() {
            $location.path('/routes');
        }

    });

})();