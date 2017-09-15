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
            var time = tellTime();
            if (time = 'day') {
                daySearch(locObj);
            } else {
                nightSerch(locObj);
            }
        };

        var daySearch = function(locObj) {
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude;
            var longLat = "32.079542,34.779720";
            var radius = "&radius=1500";
            var type = "&type=restaurant";
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var serachTerm = base + longLat + radius + type + key;
            places(serachTerm);
        };

        var nightSerch = function(locObj) {
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude;
            var longLat = "32.079542,34.779720";
            // var radius = "&radius=1500";
            // var type = "&type=restaurant";
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
                $scope.openLocations = options;
                shuffleChoice.push(options);
            }, function error(response) {
                console.log(response.statusText);
            });
        };

        $scope.shuffleData = function() {
            shuffle(shuffleChoice[0]);
        }

        $scope.makeMap = function(a, b, c) {
            console.log({ a, b, c });
            var base = "https://maps.googleapis.com/maps/api/directions/json?"
            var startEnd = "origin=" + a.vicinity + "&destination=" + c.vicinity;
            var stop = "&waypoints=" + b.vicinity;
            var type = "&travelMode=walking"
            var key = "&key=AIzaSyDBYChgRS2F1yalWlTNZ6LjaWNbJWQ11ts";
            var fullSearch = base + startEnd + stop + type + key;
            console.log(fullSearch);
        }

        // // First Initiate your map. Tie it to some ID in the HTML eg. 'MyMapID'
        var initMap = function(pos) {
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: new google.maps.LatLng(pos.latitude, pos.longitude)
            });
        }
        // // Create a new directionsService object.
        // var directionsService = new google.maps.DirectionsService;
        // directionsService.route({
        //     origin: origin.latitude + ',' + origin.longitude,
        //     destination: destination.latitude + ',' + destination.longitude,
        //     travelMode: 'DRIVING',
        // }, function(response, status) {
        //     if (status === google.maps.DirectionsStatus.OK) {
        //         var directionsDisplay = new google.maps.DirectionsRenderer({
        //             suppressMarkers: true,
        //             map: map,
        //             directions: response,
        //             draggable: false,
        //             suppressPolylines: true,
        //             // IF YOU SET `suppressPolylines` TO FALSE, THE LINE WILL BE
        //             // AUTOMATICALLY DRAWN FOR YOU.
        //         });

        //         //             // IF YOU WISH TO APPLY USER ACTIONS TO YOUR LINE YOU NEED TO CREATE A 
        //         //             // `polyLine` OBJECT BY LOOPING THROUGH THE RESPONSE ROUTES AND CREATING A 
        //         //             // LIST
        //         pathPoints = response.routes[0].overview_path.map(function(location) {
        //             return { lat: location.lat(), lng: location.lng() };
        //         });

        //         var assumedPath = new google.maps.Polyline({
        //             path: pathPoints, //APPLY LIST TO PATH
        //             geodesic: true,
        //             strokeColor: '#708090',
        //             strokeOpacity: 0.7,
        //             strokeWeight: 2.5
        //         });

        //     }
        // });

        getUserLocation();
        userCity();

    });

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