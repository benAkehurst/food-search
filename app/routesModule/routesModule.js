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
        // var userLocation = {}; // comp loc TURNED OFF FOR TESTING

        var userLocation = {
            latitude: 32.079542,
            longitude: 34.779720
        }; // Tel Aviv
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
            // userLocation = locObj; // TURNED OFF FOR TESTING
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
            getPlaces(searchTerm);
        };

        var nightSerch = function(locObj) {
            // console.log("night");
            var base = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=";
            // var longLat = locObj.latitude + "," + locObj.longitude; //comp loc TURNED OFF FOR TESTING
            var longLat = "32.079542,34.779720"; //tel aviv
            // var longLat = "51.510405, -0.131515"; //london TURNED OFF FOR TESTING
            var radius = "&radius=1500";
            // var type = "&type=cafe&type=bar"; // Bar & Cafe
            var type = "&type=bar&type=cafe"; // Bar 
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            var searchTerm = base + longLat + radius + type + key;
            getPlaces(searchTerm);
        };

        var getPlaces = function(searchTerm) {
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
                // $scope.openLocations = options;
                sorting(options);
            }, function error(response) {
                console.log(response.statusText);
            });
        };

        var to500Meters = [];
        var to1000Meters = [];
        var to1500Meters = [];

        var sorting = function(options) {
            var options = options;
            // console.log(options);
            // var to500Meters = [];
            // var to1000Meters = [];
            // var to1500Meters = [];
            for (var i = 0; i < options.length; i++) {
                if (options[i].geometry.location) {
                    var placeLatLng = {
                        lat: options[i].geometry.location.lat,
                        lng: options[i].geometry.location.lng
                    };
                    var calculatedDistance = calculateDistance(userLocation, placeLatLng);
                    // console.log(calculatedDistance);
                }
                if (calculatedDistance < 499) {
                    to500Meters.push(options[i]);
                } else if (calculatedDistance > 500 && calculatedDistance < 999) {
                    to1000Meters.push(options[i]);
                } else if (calculatedDistance > 1000 && calculatedDistance <= 1500) {
                    to1500Meters.push(options[i]);
                }
            }
            sortedRoutes(to500Meters, to1000Meters, to1500Meters);
        }

        var sortedRoutes = function(to500Meters, to1000Meters, to1500Meters) {
            var closestLoc = to500Meters;
            var medLoc = to1000Meters;
            var farLoc = to1500Meters;
            var random = randomNum(closestLoc.length, medLoc.length, farLoc.length);
            // console.log(random);
            var route = [];
            if (closestLoc) {
                route.push(closestLoc[random.loc1]);
            }
            if (medLoc) {
                route.push(medLoc[random.loc2]);
            }
            if (farLoc) {
                route.push(closestLoc[random.loc4]);
            } else if (!farLoc) {
                route.push(farLoc[random.loc3]);
            }
            $scope.closetToMe = route;
        }

        $scope.shuffle = function() {
            sortedRoutes(to500Meters, to1000Meters, to1500Meters);
        }

        $scope.makeMap = function(loc1, loc2, loc3) {
            var locObj = { loc1, loc2, loc3 };
            displayDirections(locObj);
        }

        $scope.showDetails = function(location, marker) {
            var key = "&key=AIzaSyD32rWtceO4-3aY02cxmsYwihYuNEWVIOw";
            $scope.detialsName = location.name;
            $scope.detialsHours = location.opening_hours.open_now;
            $scope.marker = marker.toUpperCase();
            $scope.detialsRating = location.rating;
            var searchTerm = "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=" + location.photos[0].photo_reference + "&sensor=false" + key;
            $scope.detailsImage = searchTerm;
        }

        getUserLocation();
        userCity();

    });

    function calculateDistance(userLocation, placeLatLng) {
        var getDistance = distance(userLocation.latitude, userLocation.longitude, placeLatLng.lat, placeLatLng.lng);
        return getDistance;
    }

    function distance(lat1, lon1, lat2, lon2) {
        // console.log('running');
        // console.log(lat1, lon1, lat2, lon2);
        var R = 6371; // km (change this constant to get miles)
        var dLat = (lat2 - lat1) * Math.PI / 180;
        var dLon = (lon2 - lon1) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        if (d > 1) return Math.round(d);
        else if (d <= 1) return Math.round(d * 1000);
        return d;
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

    function randomNum(a, b, c) {
        // console.log(a,b,c);
        var random = Math.floor(Math.random() * a) + 0;
        var random2 = Math.floor(Math.random() * b) + 0;
        var random3 = Math.floor(Math.random() * c) + 0;
        var random4 = Math.floor(Math.random() * a) + 0;
        var randomNumbers = {
            loc1: random,
            loc2: random2,
            loc3: random3,
            loc4: random4
        };
        return randomNumbers;
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