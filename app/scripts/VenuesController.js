app.controller('VenuesController', [ '$rootScope', '$scope', 'Api', function($rootScope, $scope, Api) {

    $scope.friends = [];

    Api.getVenues($rootScope.currentUserId, function (venues) {

        $scope.venues = venues;

    });

}]);
