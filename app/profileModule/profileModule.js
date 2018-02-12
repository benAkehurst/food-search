(function() {

    'use strict';
    
    var profileModule = angular.module("profileModule", []);

    profileModule.controller("ProfileController", function($http, $scope, $rootScope, $location) {

        $scope.userName = '';
        
        const userDetail = function(){
        	let userDetails = getLocalStorageItems();
            let userId = userDetails.userId;
            
            $http({
                method: "GET",
                url: "/userInfo/" + userId
            }).then(function success(res) {
                console.log(res);
                $scope.userName = res.data.name;
            }, function error(res) {
                console.log(res);
            });

        }

        $scope.savedRoutes = null;

        var getSavedRoutes = function(){
            var userInfo = getSessionItems();
            var uid = userInfo.userUid;
            // console.log(uid);
            $http({
                method:"GET",
                url:"/getallRoutes/" + uid
            }).then(function success(response){
                // console.log(response.data);
                var savedRoutes = response.data.routes;
                // console.log(savedRoutes);
                $scope.savedRoutes = savedRoutes;
            }, function error(response){
                console.log(response.statusText);
            });
        }

        userDetail();

        $scope.deleteRoute = function(route){
            // console.log(route);
            var userInfo = getSessionItems();
            var uid = userInfo.userUid;
            var route = route._id;
            $http({
                method:"DELETE",
                url:"/deleteRoute/" + uid + "/" + route
            }).then(function success(response){
                console.log(response.data);
                $scope.savedRoutes = response.data.routes;
            }, function error(response){
                console.log(response.statusText);
            });
        }

        $scope.logout = function () {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            $location.path('/login');
        }

    });

    function getLocalStorageItems() {
        let userToken = localStorage.getItem("token");
        let userId = localStorage.getItem("userId");
        let userObj = {
            token: userToken,
            userId: userId
        };
        return userObj;
    }

})();