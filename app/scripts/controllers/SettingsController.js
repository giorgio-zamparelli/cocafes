app.controller('SettingsController', [ '$rootScope', '$scope', '$location', 'Api', 'SessionManager', function($rootScope, $scope, $location, Api, SessionManager) {

    'use strict';

    $scope.venues = [];

    Api.getVenues($rootScope.currentUserId, function (venues) {

        $scope.venues = venues;

    });

    $scope.logout = function () {

        SessionManager.clear();
        $location.path("/");

    };

}]);
