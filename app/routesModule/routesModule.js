(function() {

    'use strict';

    var routesModule = angular.module("routesModule", []);

    routesModule.controller("RoutesController", function($filter, $http, $scope, $rootScope, $location) {

        var userCity = function() {
            $http({
                method: 'GET',
                url: 'https://ipinfo.io'
            }).then(function successCallback(response) {
                $scope.city = response.data.city;
            }, function errorCallback(response) {
                console.log(response);
            });
        };

        var shuffleChoice = [];
        var userLocation = {};

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
                    initMap(pos);
                });
        };

        var userLoc = function(pos) {
            var latitude = pos.latitude;
            var longitude = pos.longitude;
            var locObj = {
                latitude: latitude,
                longitude: longitude
            };
            userLocation = locObj;
            var time = tellTime();
            if (time === 'day') {
                daySearch(locObj);
            } else {
                nightSerch(locObj);
            }
        };

        var daySearch = function(locObj) {
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude;
            var longLat = "32.079542,34.779720";
            var radius = "&radius=2000";
            var type = "&type=restaurant";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var serachTerm = base + longLat + radius + type + key;
            places(serachTerm);
        };

        var nightSerch = function(locObj) {
            console.log("night");
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude;
            var longLat = "32.079542,34.779720";
            var radius = "&radius=2000";
            var type = "&type=bar";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var serachTerm = base + longLat + radius + type + key;
            places(serachTerm);
        };

        var places = function(serachTerm) {
            $http({
                method: "GET",
                url: serachTerm
            }).then(function success(response) {
                var options = results(response.data.results);
                // console.log(options);
                $scope.openLocations = options;
                shuffleChoice.push(options);
            }, function error(response) {
                console.log(response.statusText);
            });
        };

        $scope.shuffleData = function() {
            shuffle(shuffleChoice[0]);
            makeMap(loc1, loc2, loc3);
        }

        $scope.makeMap = function(loc1, loc2, loc3) {
            var locObj = { loc1, loc2, loc3 };
            displayDirections(locObj);
        }

        getUserLocation();
        userCity();

    });

    function initMap(pos) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(pos.latitude, pos.longitude)
        });
    }

    function displayDirections(locObj) {
        var directionsDisplay;
        var directionsService = new google.maps.DirectionsService();
        var map;
        var loc1 = new google.maps.LatLng(locObj.loc1.geometry.location.lat, locObj.loc1.geometry.location.lng);
        var loc2 = new google.maps.LatLng(locObj.loc2.geometry.location.lat, locObj.loc2.geometry.location.lng);
        var loc3 = new google.maps.LatLng(locObj.loc3.geometry.location.lat, locObj.loc3.geometry.location.lng);
        initialize(locObj);

        function initialize(locObj) {
            directionsDisplay = new google.maps.DirectionsRenderer();
            var mapOptions = {
                zoom: 3,
                center: new google.maps.LatLng(locObj.loc1.geometry.location.lat, locObj.loc1.geometry.location.lng)
            }
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            directionsDisplay.setMap(map);
            calcRoute();
        }

        function calcRoute() {
            var selectedMode = 'WALKING';
            var request = {
                origin: loc1,
                destination: loc3,
                waypoints: [{
                    location: loc2,
                    stopover: true
                }],
                optimizeWaypoints: true,
                travelMode: google.maps.TravelMode[selectedMode]
            };
            directionsService.route(request, function(response, status) {
                if (status == 'OK') {
                    directionsDisplay.setDirections(response);
                }
            });
        }
    }

    function tellTime() {
        var today = new Date().getHours();
        if (today >= 6 && today <= 18) {
            return 'day';
        } else {
            return 'night';
        }
    }

    function results(response) {
        var resultsArray = [];
        for (var i = 0; i < response.length; i++) {
            resultsArray.push(response[i]);
        }
        var shuffledArray = shuffle(resultsArray);
        var openNowLocations = [];
        for (var i = 0; i < shuffledArray.length; i++) {
            if (shuffledArray[i].opening_hours == undefined) {} else if (shuffledArray[i].opening_hours.open_now === true && shuffledArray[i].rating >= 3.5) {
                openNowLocations.push(shuffledArray[i]);
            }
        }
        var openNowResults = shuffle(openNowLocations);
        return openNowResults;
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        // console.log(array);
        return array;
    }

})();