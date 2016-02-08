app.controller('PersonController', [ '$rootScope', '$scope', 'Api', function($rootScope, $scope, Api) {

    $scope.friends = [];

    Api.getFriends($rootScope.currentUserId, function (friends) {

        $scope.friends = friends;

    });

}]);
