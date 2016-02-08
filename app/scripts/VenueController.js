app.controller('VenueController', [ '$rootScope', '$scope', 'Api', function($rootScope, $scope, Api) {

    $scope.venues = [];

    Api.getVenues($rootScope.currentUserId, function (venues) {

        $scope.venues = venues;

    });

}]);
