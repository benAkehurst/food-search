(function() {

    'use strict';
    
    var profileModule = angular.module("profileModule", []);

    profileModule.controller("ProfileController", function($http, $scope, $rootScope, $location) {

        var userDetail = function(){
        	var userDetails = getSessionItems();
        	$scope.userDetail = userDetails;
        }

        userDetail();

        $scope.logout = function() {
            sessionStorage.clear();
            $location.path('/login');
        }

    });

    function getSessionItems() {
        var sessionName = sessionStorage.getItem("name");
        return sessionName;
    }

})();