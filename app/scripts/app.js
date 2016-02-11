var app = angular.module('app', ['ngRoute', 'LocalStorageModule']);

app.config([ '$routeProvider', function($routeProvider) {

    $routeProvider.

    when('/', {
		templateUrl : 'views/login.html',
		controller : 'LoginController',
		access: {
			isPublic : true
		}
	}).

	when('/people', {
		templateUrl : 'views/people.html',
		controller : 'PeopleController',
		access: {
			isPublic : false
		}
	}).

    when('/people/:personId', {
		templateUrl : 'views/person.html',
		controller : 'PersonController',
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

        if(!SessionManager.isLoggedIn() && nextRoute.access && !nextRoute.access.isPublic) {

            $location.path('/');

        }

	});

} ]);
