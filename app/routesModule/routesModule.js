(function() {

    'use strict';

    var routesModule = angular.module("routesModule", []);

    routesModule.controller("RoutesController", function($q, $http, $scope, $rootScope, $location) {
        
        var userLoc = function(pos) {
            var latitude = pos.latitude;
            var longitude = pos.longitude;
            places(latitude, longitude);
        }

        var places = function(latitude, longitude) {
            var latitude = latitude;
            var longitude = longitude;
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            var longLat = latitude + "," + longitude;
            var radiusType = "&radius=2000&type=restaurant";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var serachTerm = base + longLat + radiusType + key;

            $http({
                method: "GET",
                url: serachTerm
            }).then(function success(response) {
                $scope.locationResults = response.data;
            }, function error(response) {
                console.log(response.statusText);
            });
        }

        var getUserLocation = function() {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    var latitude = position.coords.latitude;
                    var longitude = position.coords.longitude;
                    var timeStamp = position.coords.timestamp;
                    var accuracy = position.coords.accuracy;
                    var pos = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.coords.timestamp,
                        accuracy: position.coords.accuracy
                    };
                    userLoc(pos);
                });
        }
        getUserLocation();

    });
})();