app.service('SessionManager', ['$rootScope', 'localStorageService', 'UsersStorage', 'SessionPreferences', function($rootScope, localStorageService, UsersStorage, SessionPreferences){

	'use strict';

	return {

		/**
    	 * @memberOf SessionManager
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'SessionManager',

		isLoggedIn: function() {

			var isLoggedIn = false;

			var currentUserId = SessionPreferences.getCurrentUserId();
        	var validCurrentUserId = currentUserId && currentUserId.length > 0;

            if(validCurrentUserId) {

	            var validCurrentUser = UsersStorage.getUser(currentUserId);

                if(validCurrentUser) {
	                isLoggedIn = true;
	            }

	        }

	        if(!isLoggedIn) {
	            this.clear();
	        }

	        return isLoggedIn;

		},

        restoreSession: function(user) {

			$rootScope.currentUserId 		= SessionPreferences.getCurrentUserId();

		},

		storeNewSession: function(user) {

			UsersStorage.addOrUpdateUser(user);

            SessionPreferences.setCurrentUserId(user._id);

		},

		clear: function() {

			localStorageService.clearAll();

		}

    };

}]);
