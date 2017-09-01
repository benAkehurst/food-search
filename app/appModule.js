(function(){
    
    'use strict';
    
    var appModule = angular.module("app", ["ngRoute","ngMaterial","loginModule","routesModule", "exploreModule","profileModule"])
    
      appModule.config(function($routeProvider){
        
        $routeProvider
        .when("/",{
            controller:"LoginController",
            templateUrl:"app/loginModule/loginView.html"
        })
        .when("/login",{
            controller:"LoginController",
            templateUrl:"app/loginModule/loginView.html"
        })
        .when("/routes",{
            controller:"RoutesController",
            templateUrl:"app/routesModule/routesView.html"
        })
        .when("/routes/saveRoute",{
            controller:"RoutesController",
            templateUrl:"app/routesModule/routesView.html"
        })
        .when("/routes/getAllRoutes",{
            controller:"RoutesController",
            templateUrl:"app/routesModule/routesView.html"
        })
        .when("/routes/editRoute/:_id",{
            controller:"RoutesController",
            templateUrl:"app/routesModule/routesView.html"
        })
        .when("/routes/deleteRoute/:_id",{
            controller:"RoutesController",
            templateUrl:"app/routesModule/routesView.html"
        })
        .when("/explore",{
            controller:"ExploreController",
            templateUrl:"app/exploreModule/exploreView.html"
        })
        .when("/profile",{
            controller:"ProfileController",
            templateUrl:"app/profileModule/profileView.html"
        })
        .otherwise({
			redirectTo:"/"
		});
        
    });
    
})();