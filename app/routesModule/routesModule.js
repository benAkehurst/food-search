(function() {

    'use strict';

    var routesModule = angular.module("routesModule", []);

    routesModule.controller("RoutesController", function($q, $http, $scope, $rootScope, $location) {

        var userCity = function() {
            $http({
                method: 'GET',
                url: 'https://ipinfo.io'
            }).then(function successCallback(response) {
                $scope.city = response.data.city;
                // var loc = response.data.loc;
            }, function errorCallback(response) {
                console.log(response);
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

        var userLoc = function(pos) {
            var latitude = pos.latitude;
            var longitude = pos.longitude;
            var locObj = {
                latitude: latitude,
                longitude: longitude
            }
            makeSearch(locObj);
        }

        var makeSearch = function(locObj) {
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            var longLat = locObj.latitude + "," + locObj.longitude;
            var radius = "&radius=2500"
            var type = "&type=restaurant";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var serachTerm = base + longLat + radius + type + key;
            places(serachTerm);
        }

        var places = function(serachTerm) {
            $http({
                method: "GET",
                url: serachTerm
            }).then(function success(response) {
                console.log(response.data);
                $scope.items = response.data.results;
            }, function error(response) {
                console.log(response.statusText);
            });
        }

        var results = function(response){
            //make a blank array
            //loop though and make response.results go in each cell
            // randomise order
            // if statement to loop though places and check if somewhere is open
            // if yes, push to new array
            // randomise new array 
            //loop though new array and make an object first each 3 results and push to new array
            // put array on scope
        }

        getUserLocation();
        userCity();

    });

})();