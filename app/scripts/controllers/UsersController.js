app.controller('UsersController', [ '$rootScope', '$scope', 'Api', function($rootScope, $scope, Api) {

    'use strict';

    $scope.friends = [];

    Api.getFriends($rootScope.currentUserId, function (friends) {

        $scope.friends = friends;

    });

}]);
