app.service('SessionPreferences', ['$rootScope', 'NodeLocalStorage', function($rootScope, NodeLocalStorage){

	'use strict';

	return {

		/**
    	 * @memberOf SessionPreferences
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'SessionPreferences',

		getCurrentUserId: function() {

    		return NodeLocalStorage.get("currentUserId");

        },

        setCurrentUserId: function(currentUserId) {

    		$rootScope.currentUserId = currentUserId;

    		return NodeLocalStorage.add("currentUserId", currentUserId);

        },


    };

}]);
