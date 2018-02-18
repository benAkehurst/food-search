(function() {

    'use strict';

    var isDlgOpen;

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location, $timeout) {

        $scope.signUpSuccess = false;

        $scope.login = function () {
            var loginObj = {
                email: $scope.login_form_email,
                password: $scope.login_form_password
            }
            $http({
                method: "POST",
                url: '/login',
                data: loginObj
            }).then(function success(res) {
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('userId', res.data.userId);
                $location.path('/routes');
            }, function error(res) {
                // TODO: Show Error
                console.log(res);
            });
        };

        $scope.signUp = function() {
            var signupObj = {
                name: $scope.sign_up_form_name,
                email: $scope.sign_up_form_email,
                password: $scope.sign_up_form_password
            }
            $http({
                method: "POST",
                url: '/registerUser',
                data: signupObj
            }).then(function success(res) {
                if (res.status == 201) {
                    console.log(res);
                    $scope.signUpSuccess = true;
                }
            }, function error(res) {
                // TODO: Show Error
            });
        };

        $scope.redirectToRoutes = function () {
            $location.path('/routes');
        };

    });

})();