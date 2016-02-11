app.service('SessionPreferences', ['$rootScope', 'localStorageService', function($rootScope, localStorageService){

	'use strict';

	return {

		/**
    	 * @memberOf SessionPreferences
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'SessionPreferences',

		getCurrentUserId: function() {

    		return localStorageService.get("currentUserId");

        },

        setCurrentUserId: function(currentUserId) {

    		$rootScope.currentUserId = currentUserId;

    		return localStorageService.add("currentUserId", currentUserId);

        },


    };

}]);
