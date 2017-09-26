(function() {

    'use strict';
    
    var profileModule = angular.module("profileModule", []);

    profileModule.controller("ProfileController", function($http, $scope, $rootScope, $location) {

        var userDetail = function(){
        	var userDetails = getSessionItems();
        	$scope.userDetail = userDetails.sessionName;
        }

        var getSavedRoutes = function(){
            var userInfo = getSessionItems();
            var uid = userInfo.userUid;
            // console.log(uid);
            $http({
                method:"GET",
                url:"/getallRoutes/" + uid
            }).then(function success(response){
                console.log(response.data);
                var savedRoutes = response.data.routes;
                // console.log(savedRoutes);
                $scope.savedRoutes = savedRoutes;
            }, function error(response){
                console.log(response.statusText);
            });
        }

        userDetail();
        getSavedRoutes();

        $scope.deleteRoute = function(route){
            console.log(route);
        }

        $scope.logout = function() {
            sessionStorage.clear();
            $location.path('/login');
        }

    });

    function getSessionItems() {
        var sessionName = sessionStorage.getItem("name");
        var userUid = sessionStorage.getItem("uid");
        var sessinInfo = {
            sessionName:sessionName,
            userUid: userUid
        }
        return sessinInfo;
    }

})();