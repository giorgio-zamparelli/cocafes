//MONGOLAB_URI: mongodb://heroku_cpslwj5x:osv1hu4kictp62jrnoepc116gh@ds059115.mongolab.com:59115/heroku_cpslwj5x

app.service('Api', [ '$http', 'Restangular', function($http, Restangular){

	'use strict';

	//var baseUrl = "https://waiterio-v2.herokuapp.com/api/v2";
	var baseUrl = "http://localhost:8080/api/v2";

	Restangular.setBaseUrl(baseUrl);
	Restangular.setDefaultHeaders({"Content-Type": "application/json"});

    return {

    	/**
    	 * @memberOf Api
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'Api',

			getMenu: function(restaurantId, success, failure) {

    		Restangular.one('restaurants', restaurantId).one('menus').get().then(

				function (menus) {

					Menu.extend(menus[0]);

					if (success) {
                        success(menus[0]);
                    }

                },

                function (response) {

                	console.log('Failure GET restaurants/' + restaurantId + '/menus');

					if (failure) {
                        failure(response);
                    }

                }

            );

        }

    };
}]);
