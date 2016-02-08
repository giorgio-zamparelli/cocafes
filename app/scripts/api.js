//MONGOLAB_URI: mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x

app.service('Api', [ '$http', function($http){

	'use strict';

	//var baseUrl = "https://waiterio-v2.herokuapp.com/api/v2";
	var baseUrl = "http://localhost:3000/api/v1";

    return {

    	/**
    	 * @memberOf Api
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'Api',

		getFriends: function(personId, success, failure) {

			$http({method: 'GET', url: baseUrl + '/people/' + personId + '/friends'}).

        		success(function(friends, status, headers, config) {

        			if (success) {
                        success(friends);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure GET ' + baseUrl + '/people' + personId + '/friends');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	},

		getPeople: function(success, failure) {

			$http({method: 'GET', url: baseUrl + '/people'}).

        		success(function(people, status, headers, config) {

        			if (success) {
                        success(people);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure GET ' + baseUrl + '/people');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	},

		getVenues: function(personId, success, failure) {

			$http({method: 'GET', url: baseUrl + '/venues'}).

        		success(function(venues, status, headers, config) {

        			if (success) {
                        success(venues);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure GET ' + baseUrl + '/venues');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	}

    };
}]);
