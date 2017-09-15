(function() {

    'use strict';

    var appModule = angular.module("appModule", ["ngRoute",
            "ngMaterial",
            "loginModule",
            "routesModule",
            "exploreModule",
            "profileModule"
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

                .when("/explore", {
                    controller: "ExploreController",
                    templateUrl: "app/exploreModule/exploreView.html"
                })

                .when("/profile", {
                    controller: "ProfileController",
                    templateUrl: "app/profileModule/profileView.html"
                })

                .otherwise({
                    redirectTo: "/routes"
                });

        })

        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('blue')
                .accentPalette('orange');

        });
})();