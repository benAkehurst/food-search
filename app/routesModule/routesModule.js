(function() {

    'use strict';

    var routesModule = angular.module("routesModule", []);

    routesModule.controller("RoutesController", function ($filter, $http, $scope, $rootScope, $location, checkLoggedIn) {

        let userStatus = checkLoggedIn.userStatus();
        let userId = userStatus.userId;
        $scope.loggedIn = userStatus;
        $scope.loadingIcon = false;
        $scope.hideRoutes = false;
        $scope.saveSuccess = false;
        $scope.saveFail = false;
        var shuffleChoice = [];
        var userLocation = {};
        // var userLocation = { latitude: 32.079542, longitude: 34.779720}; // Tel Aviv // TURNED OFF FOR TESTING
        // var userLocation = { latitude: 51.513044, longitude: -0.124476}; // covent garden
        var to500Meters = [];
        var to1000Meters = [];
        var to1500Meters = [];

        // On Init Items
        var userCity = function () {
            $http({
                method: 'GET',
                url: 'https://ipinfo.io'
            }).then(function successCallback(response) {
                $scope.city = response.data.region;
            }, function errorCallback(response) {
                console.log(response);
            });
        };
        var getUserLocation = function () {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    var pos = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        timestamp: position.timestamp,
                        accuracy: position.coords.accuracy
                    };
                    userLoc(pos);
                    initMap(pos);
                });
        };
        var userLoc = function (pos) {
            var latitude = pos.latitude;
            var longitude = pos.longitude;
            var locObj = {
                latitude: latitude,
                longitude: longitude
            };
            userLocation = locObj; // TURNED OFF FOR TESTING
            var time = tellTime();
            if (time === 'day') {
                daySearch(locObj);
            } else {
                nightSerch(locObj);
            }
        };

        // Route Options
        $scope.radius = [1500, 2000, 2500];
        $scope.selectedItem;
        $scope.getSelectedText = function () {
            if ($scope.selectedItem !== undefined) {
                return "You have selected: " + $scope.selectedItem + 'm';
            } else {
                return "Please select an distance";
            }
        };
        $scope.typesOfLocation = ['resturant', 'bar', 'cafe', ];


        // TODO: Here are the functions where I need to enter user selected params
        var daySearch = function(locObj) {
            var longLat = locObj.latitude + "," + locObj.longitude; //comp loc TURNED OFF FOR TESTING
            // var longLat = "32.079542,34.779720"; //tel aviv
            // var longLat = "51.510405,-0.131515"; //london TURNED OFF FOR TESTING
            // var longLat = "52.362613,4.886519"; //Amsterdam
            var radius = "&radius=1500";
            // var type = "&type=cafe&type=bar"; // Bar & Cafe
            // var type = "&type=resturant"; // Bar & Cafe
            var type = "&type=cafe"; // cafe
            var searchParams = {
                location: longLat,
                radius: radius,
                type: type
            };
            console.log(searchParams);
            routeOptions(searchParams);
        };

        var nightSerch = function(locObj) {
            // var longLat = locObj.latitude + "," + locObj.longitude; //comp loc TURNED OFF FOR TESTING
            var longLat = "32.079542,34.779720"; //tel aviv
            // var longLat = "51.510405,-0.131515"; //london TURNED OFF FOR TESTING
            // var longLat = "52.362613, 4.886519"; //Amsterdam
            var radius = "&radius=1500";
            // var type = "&type=cafe&type=bar"; // Bar & Cafe
            var type = "&type=bar&type=cafe"; // Bar
            var searchParams = {
                location: longLat,
                radius: radius,
                type: type
            };
            routeOptions(searchParams);
        };

        var routeOptions = function(searchParams) {
            var data = searchParams;
            $http({
                method: "POST",
                url: '/routeOptions',
                data: data
            }).then(function success(response) {
                $scope.loadingIcon = true;
                var options = results(response.data.results);
                console.log(options);
                if (options.length <= 2) {
                    $scope.hideRoutes = true;
                }
                sorting(options);
            }, function error(response) {
                console.log(response.statusText);
                $scope.errorMessage = response.statusText;
            });
        };

        var sorting = function(options) {
            var options = options;
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
        };

        var sortedRoutes = function(to500Meters, to1000Meters, to1500Meters) {
            var closestLoc = to500Meters;
            var medLoc = to1000Meters;
            var farLoc = to1500Meters;
            var random = randomNum(closestLoc.length, medLoc.length, farLoc.length);
            // console.log(random);
            var route = [];
            // console.log(route);
            if (closestLoc) {
                route.push(closestLoc[random.loc1]);
                route.push(closestLoc[random.loc2]);
                route.push(closestLoc[random.loc4]);
            }
            // if (medLoc) {
            //     route.push(medLoc[random.loc2]);
            // }
            // if (farLoc) {
            //     route.push(closestLoc[random.loc4]);
            // } else if (!farLoc) {
            //     route.push(farLoc[random.loc3]);
            // }
            $scope.closetToMe = route;
        };

        $scope.shuffle = function() {
            sortedRoutes(to500Meters, to1000Meters, to1500Meters);
        };

        $scope.makeMap = function(loc1, loc2, loc3) {
            var locObj = { loc1, loc2, loc3 };
            displayDirections(locObj);
        }

        $scope.showDetails = function(location, marker) {
            var loacation = location.photos[0].photo_reference;
            var data = { ref: loacation };
            // console.log(data);
            $http({
                method: "POST",
                url: '/getPlaceImage',
                data: data
            }).then(function success(response) {
                // console.log(response.data);
                $scope.detailsImage = response.data;
            }, function error(response) {
                console.log(response.statusText);
            });
            $scope.detialsName = location.name;
            $scope.marker = marker.toUpperCase();
            $scope.detialsRating = location.rating;
        };

        $scope.saveRoute = function(loc1, loc2, loc3) {
            var route = {
                loc1: loc1,
                loc2: loc2,
                loc3: loc3
            };
            var data = {
                uid: userId,
                routes: route
            };
            // console.log(data);
            $http({
                method: "POST",
                url: '/saveRoute',
                data: data
            }).then(function success(response) {
                if(response.data = 200){
                    console.log("Route Saved");
                    $scope.saveSuccess = true;
                    toastr.info('Are you the 6 fingered man?');
                }
            }, function error(response) {
                console.log(response.statusText);
                $scope.saveFail = true;
            });
        };

        getUserLocation();
        userCity();

    });

    function initMap(pos) {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(pos.latitude, pos.longitude),
        });
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(pos.latitude, pos.longitude),
            map: map,
            title: 'You Are Here!'
        });
    }

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

    function getLocalStorageItems() {
        let userToken = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        let userObj = {
            token: userToken,
            userId: userId
        };
        return userObj;
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
        // console.log(resultsArray);
        for (var i = 0; i < response.length; i++) {
            resultsArray.push(response[i]);
        }
        var shuffledArray = shuffle(resultsArray);
        var openNowLocations = [];
        // console.log(openNowLocations);
        for (var i = 0; i < shuffledArray.length; i++) {
            // if (shuffledArray[i].opening_hours == undefined) {} else if (shuffledArray[i].opening_hours.open_now === true && shuffledArray[i].rating > 2) {
                openNowLocations.push(shuffledArray[i]);
            // }
        }
        var openNowResults = shuffle(openNowLocations);
        // console.log(openNowResults);
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

    function getSessionData() {
        var sessionLoggedIn = sessionStorage.getItem("loggedIn");
        var userUid = sessionStorage.getItem("uid");
        var sessionData = {
            loggedIn: sessionLoggedIn,
            uid: userUid
        }
        return sessionData;
    }

})();