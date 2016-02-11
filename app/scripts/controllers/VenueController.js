app.controller('VenueController', [ '$rootScope', '$scope', 'Api', function($rootScope, $scope, Api) {

    'use strict';

    $scope.venues = [];

    Api.getVenues($rootScope.currentUserId, function (venues) {

        $scope.venues = venues;

    });

}]);
