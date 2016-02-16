var app = angular.module('app', ['ngRoute', 'angularMoment']);

app.config([ '$routeProvider', function($routeProvider) {

    $routeProvider.

    when('/', {
		templateUrl : 'views/login.html',
		controller : 'LoginController',
		access: {
			isPublic : true
		}
	}).

	when('/users', {
		templateUrl : 'views/users.html',
		controller : 'UsersController',
		access: {
			isPublic : false
		}
	}).

    when('/users/:userId', {
		templateUrl : 'views/user.html',
		controller : 'UserController',
		access: {
			isPublic : false
		}
	}).

    when('/settings', {
		templateUrl : 'views/settings.html',
		controller : 'SettingsController',
		access: {
			isPublic : false
		}
	}).

    when('/venues', {
		templateUrl : 'views/venues.html',
		controller : 'VenuesController',
		access: {
			isPublic : false
		}
	}).

    when('/venues/:venueId', {
		templateUrl : 'views/venue.html',
		controller : 'VenueController',
		access: {
			isPublic : false
		}
	});

}]);

app.run([ '$rootScope', '$location', 'SessionManager', 'SessionPreferences', function($rootScope, $location, SessionManager, SessionPreferences) {

    SessionManager.restoreSession();

    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

        if(SessionManager.isLoggedIn()) {

            if (nextRoute.$$route.originalPath === "" || nextRoute.$$route.originalPath === "/") {
                $location.path('/users');
            }

        } else if (nextRoute.access && !nextRoute.access.isPublic) {

            $location.path('/');

        }

	});

} ]);
