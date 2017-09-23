(function() {

    'use strict';

    var isDlgOpen;

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location, $timeout) {

        $scope.signUpSuccess = false;

        $scope.login = function(email, password) {
            // console.log("Login")
            var data = {
                email: email,
                password: password
            };
            $http({
                method: "POST",
                url: '/login',
                data: data
            }).then(function success(response) {
                // console.log(response.data);
                var userEmail = data.email;
                // console.log(userEmail);
                if (response.data.loggedIn === true) {
                    // console.log("loged in");
                    makeToken(userEmail);
                    $location.path('/routes');
                }
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
                if (response.data.signUpSuccess === true) {
                    // console.log("Signed UP");
                    makeToken();
                    $scope.signUpSuccess = true;
                    $timeout(function() {
                        $scope.signUpSuccess = false;
                        $location.path('/routes');
                    }, 3000);
                }
            }, function error(response) {
                console.log(response.statusText);
            });

        }

        $scope.redirectToRoutes = function() {
            $location.path('/routes');
        }

    });

    function makeToken(email) {
    	var userEmail = email;
        sessionStorage.setItem("loggedIn", "true");
        localStorage.setItem("stayLoggedIn", "true");
        localStorage.setItem("email", userEmail);
    }

})();