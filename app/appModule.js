(function() {

    'use strict';

    var appModule = angular.module("appModule", ["ngRoute",
        "ngMaterial",
        "loginModule",
        "routesModule",
        "exploreModule",
        "profileModule",
        "navBarModule"
    ]);


    appModule.config(function($routeProvider) {

            $routeProvider

                .when("/login", {
                    // resolve: {
                    //     "check": function($location) {
                    //         if (sessionStorage.userLoggedIn) {
                    //             $location.path("/school");
                    //         }
                    //     }
                    // },
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

                .when("/explore", {
                    controller: "ExploreController",
                    templateUrl: "app/exploreModule/exploreView.html"
                })

                .when("/profile", {
                    resolve: {
                        "check": function($location) {
                            if (sessionStorage.loggedIn) {
                                $location.path("/profile");
                            } else if (localStorage.stayLoggedIn) {
                                $location.path("/profile");
                            } else {
                                $location.path("/login");
                            }
                        }
                    },
                    controller: "ProfileController",
                    templateUrl: "app/profileModule/profileView.html"
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
                .accentPalette('orange');

        });
})();