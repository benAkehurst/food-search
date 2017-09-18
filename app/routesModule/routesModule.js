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
        $scope.loadingIcon = false;
        $scope.hideRoutes = false;

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
            // var longLat = locObj.latitude + "," + locObj.longitude; //comp loc
            var longLat = "32.079542,34.779720"; //tel aviv
            var radius = "&radius=5000";
            var type = "&type=cafe";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var searchTerm = base + longLat + radius + type + key;
            places(searchTerm);
        };

        var nightSerch = function(locObj) {
            // console.log("night");
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude; //comp loc
            var longLat = "32.079542,34.779720"; //tel aviv
            // var longLat = "51.510405, -0.131515"; //london
            var radius = "&radius=1500";
            var type = "&type=bar";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var searchTerm = base + longLat + radius + type + key;
            places(searchTerm);
        };

        var places = function(searchTerm) {
            $http({
                method: "GET",
                url: searchTerm
            }).then(function success(response) {
                $scope.loadingIcon = true;
                var options = results(response.data.results);
                if (options.length <= 2) {
                    $scope.hideRoutes = true;
                }
                // console.log(options);
                $scope.openLocations = options;
                sorting(options);
            }, function error(response) {
                console.log(response.statusText);
            });
        };

        var sorting = function(options) {
            var options = options;
            // console.log(options);
            var to500Meters = [];
            var to1000Meters = [];
            var to1500Meters = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].geometry.location) {
                    var placeLatLng = {
                        lat: options[i].geometry.location.lat,
                        lng: options[i].geometry.location.lng
                    };
                    var calculatedDistance = calculateDistance(userLocation, placeLatLng);
                    console.log(calculatedDistance);
                }
            }
        }

        $scope.makeMap = function(loc1, loc2, loc3) {
            var locObj = { loc1, loc2, loc3 };
            displayDirections(locObj);
        }

        $scope.shuffle = function(){
            shuffle($scope.openLocations);
        }

        getUserLocation();
        userCity();

    });



    function calculateDistance(userLatLng, placeLatLng) {
        var locations = { userLatLng, placeLatLng };
        console.log(locations);
        console.log("User LatLng: " + userLatLng.latitude +"," + userLatLng.longitude  + " " + "Place LatLng: " + placeLatLng.lat +"," + placeLatLng.lng );
        var userLocation = userLatLng.latitude +","+ userLatLng.longitude;
        var placeLocation = placeLatLng.lat +","+ placeLatLng.lng;
        return placeLocation;
    }

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
            if (shuffledArray[i].opening_hours == undefined) {} else if (shuffledArray[i].opening_hours.open_now === true && shuffledArray[i].rating > 3) {
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