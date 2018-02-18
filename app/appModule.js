(function() {

    'use strict';

    var appModule = angular.module("appModule", ["ngRoute",
        "ngMaterial",
        "loginModule",
        "routesModule",
        "profileModule",
        "navBarModule"
    ]);


    appModule.config(function($routeProvider) {

            $routeProvider

                .when("/login", {
                    controller: "LoginController",
                    templateUrl: "app/loginModule/loginView.html"
                })

                .when("/routes", {
                    controller: "RoutesController",
                    templateUrl: "app/routesModule/routesView.html"
                })

                .when("/routes/saveRoute", {
                    controller: "RoutesController",
                    templateUrl: "app/routesModule/routesView.html"
                })

                .when("/routes/getallRoutes", {
                    controller: "RoutesController",
                    templateUrl: "app/routesModule/routesView.html"
                })

                .when("/routes/editRoute/:_id", {
                    controller: "RoutesController",
                    templateUrl: "app/routesModule/routesView.html"
                })

                .when("/routes/deleteRoute/:_id", {
                    controller: "RoutesController",
                    templateUrl: "app/routesModule/routesView.html"
                })

                .when("/profile", {
                    controller: "ProfileController",
                    templateUrl: "app/profileModule/profileView.html",
                    resolve: {
                        app: function ($q, $location) {
                            var defer = $q.defer();
                            var loginToken = localStorage.getItem('token');
                            if (!loginToken) {
                                $location.path('/login');
                            };
                            defer.resolve();
                            return defer.promise;
                        }
                    }
                })

                .otherwise({
                    redirectTo: "/login"
                });

        })
        
        .directive('navbar', function() {
            return {
                templateUrl: 'app/directives/navBar.html',
                controller: 'NavBarController'
            };
        })

        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('green');

        })

        .service('checkLoggedIn', function ($rootScope) {
            
            this.userStatus = function () {
            let checkStatus = getLocalStorageItems();
            if (checkStatus.token) {
                let loggedInItems = {
                    "status": true,
                    "userId": checkStatus.userId
                }
                return loggedInItems;
            }
            else {
                return false;
            }
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