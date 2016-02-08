app.controller('PeopleController', [ '$rootScope', '$scope', '$timeout', 'Api', function($rootScope, $scope, $timeout, Api) {

    $scope.friends = [];

    Api.getFriends($rootScope.currentUserId, function (friends) {

        $scope.friends = friends;

    });


}]);
