//MONGOLAB_URI: mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x

app.service('Api', [ '$http', function($http){

	'use strict';

	const host = require('electron').remote.getGlobal("host");
	const port = require('electron').remote.getGlobal("port");

	const baseUrl = (port === 443 ? "https://" : "http://") + host + ":" + port + "/api/v1";

    return {

    	/**
    	 * @memberOf Api
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'Api',

		loginWithFacebook: function(facebookCode, success, failure) {

			$http({method: 'POST', url: baseUrl + '/authentication/login/facebook', headers: {'Authorization': 'Facebook ' + facebookCode}}).

        		success(function(user, status, headers, config) {

        			if (success) {
                        success(user);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure POST ' + baseUrl + '/authentication/login/facebook');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	},

		getFriends: function(userId, success, failure) {

			$http({method: 'GET', url: baseUrl + '/users/' + userId + '/friends'}).

        		success(function(friends, status, headers, config) {

        			if (success) {
                        success(friends);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure GET ' + baseUrl + '/users' + userId + '/friends');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	},

		getUsers: function(success, failure) {

			$http({method: 'GET', url: baseUrl + '/users'}).

        		success(function(users, status, headers, config) {

        			if (success) {
                        success(users);
                    }

        		}).error(function(response, status, headers, config) {

        			console.log('Failure GET ' + baseUrl + '/users');

					if (failure) {
						failure(status + ' ' + response);
					}

        		}

			);

    	},

		getVenues: function(userId, success, failure) {

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
