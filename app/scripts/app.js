var app = angular.module('app', ['ngRoute']);

app.config([ '$routeProvider', function($routeProvider) {

    $routeProvider.

    when('/', {
		templateUrl : 'views/login.html',
		controller : 'LoginController'
	}).

	when('/people', {
		templateUrl : 'views/people.html',
		controller : 'PeopleController'
	}).

    when('/people/:personId', {
		templateUrl : 'views/person.html',
		controller : 'PersonController'
	}).

    when('/settings', {
		templateUrl : 'views/settings.html',
		controller : 'SettingsController'
	}).

    when('/venues', {
		templateUrl : 'views/venues.html',
		controller : 'VenuesController'
	}).

    when('/venues/:venueId', {
		templateUrl : 'views/venue.html',
		controller : 'VenueController'
	});

}]);

app.run([ '$rootScope', '$window', '$location', function($rootScope, $window, $location) {

    //$rootScope.currentUserId = "";

} ]);
