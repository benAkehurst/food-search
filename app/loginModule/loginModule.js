(function() {

    'use strict';

    var isDlgOpen;

    var loginModule = angular.module("loginModule", []);

    loginModule.controller("LoginController", function($http, $route, $scope, $rootScope, $location, $timeout) {

        $scope.signUpSuccess = false;

        $scope.login = function(email, password) {
            // console.log("Login");
            var data = {
                email: email,
                password: password
            };
            
            $http({
                method:"GET",
                url:"/userInfo/" + data.email
            }).then(function success(response){
                var userName = response.data.name;
                makeNameToken(userName);
                // console.log(response.data);
                // var userName = response.data.name;
                // console.log(userName);
            }, function error(response){
                console.log(response.statusText);
            });
            
            $http({
                method: "POST",
                url: '/login',
                data: data
            }).then(function success(response) {
                // console.log(response.data);
                var uid = response.data.userUid;
                var userEmail = data.email;
                // console.log(userEmail);
                if (response.data.loggedIn === true) {
                    // console.log("loged in");
                    makeToken(userEmail, uid);
                    $rootScope.loggedIn = true;
                    $location.path('/routes');
                }
            }, function error(response) {
                console.log(response.statusText);
            });
        }

        $scope.signUp = function(name, email, password) {
            // console.log("signup Called");
            var data = {
                name: name,
                email: email,
                password: password
            };
            $http({
                method: "POST",
                url: '/registerUser',
                data: data
            }).then(function success(response) {
                $scope.sign_up_form.$setPristine();
                var uid = response.data.uid;
                if (response.data.signUpSuccess === true) {
                    // console.log("Signed UP");
                    makeToken(data.name, data.email, uid);
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

    function makeToken(name,email, uid) {
        var userName = name;
        var userEmail = email;
        var userUid = uid;
        sessionStorage.setItem("loggedIn", "true");
        sessionStorage.setItem("name", userName);
        sessionStorage.setItem("email", userEmail);
        sessionStorage.setItem("uid", userUid);
    }

    function makeNameToken(name){
        var userName = name;
        sessionStorage.setItem("name", userName);
    }

})();