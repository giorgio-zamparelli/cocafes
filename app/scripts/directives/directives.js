app.directive('ngNavigate', [ '$location', function($location) {

	'use strict';

	return {
		restrict : 'A',
		link : function(scope, element, attrs) {

			var path;

			attrs.$observe( 'ngNavigate', function (val) {
				path = val;
			});

			element.bind( 'click', function () {
				scope.$apply( function () {
					$location.path( path );
				});
			});


		}

	};

} ]);
