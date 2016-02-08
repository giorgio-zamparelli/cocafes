app.controller('HeaderCtrl', [ '$rootScope', '$scope', '$location', function($rootScope, $scope, $location) {

    'use strict';

	$scope.isActive = function(viewLocation) {

		return viewLocation === $location.path();

	};

} ]);
