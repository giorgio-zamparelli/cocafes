app.controller('PeopleController', [ '$scope', '$timeout', '$firebaseObject', function($scope, $timeout, $firebaseObject) {

    $scope.friends = [];

    var peopleRef = new Firebase("https://coworker.firebaseio.com/people");

    var friendsRef = new Firebase("https://coworker.firebaseio.com/people/629795542/friendsIds");

    friendsRef.on("child_added", function(snapshotFriend) {

        var friendId = snapshotFriend.key();

        peopleRef.child(friendId).on('value', function(snapshotPerson) {

            $timeout(function() {

                if( snapshotPerson.val() === null ) {

                    // the friend was deleted
                    delete $scope.friends[friendId];

                } else {

                    $scope.friends[friendId] = snapshotPerson.val();
                    console.log("$scope.friends" + JSON.stringify($scope.friends));

                }

            });

         });

    });

    // watch the index for remove events
    friendsRef.on('child_removed', function(snapshot) {

        // trigger $digest/$apply so Angular updates the DOM
        $timeout(function(snapshot) {

            delete $scope.friends[snapshot.key()];

        });

     });

}]);
