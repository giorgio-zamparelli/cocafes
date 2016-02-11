app.service('UsersStorage', ['localStorageService', function(localStorageService){

	'use strict';

	var prefix = 'coworker.users.';

	return {

		/**
    	 * @memberOf UsersStorage
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'UsersStorage',

    	addOrUpdateUser: function(user) {

    		if(!user._id) {

    			user._id = UUID.generate();
    			user.lastEditTime = new Date().getTime();

    		}

    		if(user.creationTime === 0) {

    			user.creationTime = new Date().getTime();
    			user.lastEditTime = user.creationTime;

    		}

    		return localStorageService.add(prefix + user._id, user) ? user._id : undefined;

        },

		contains: function(userId) {

			return localStorageService.get(prefix + userId) ? true : false;

		},

        deleteUser: function(userId) {

			var user = this.getUser(userId);

			if (user) {

				localStorageService.remove(prefix + userId);

			} else {

				userId = undefined;

			}

			return userId;

        },

    	getUser: function(userId) {

			var user = localStorageService.get(prefix + userId);

			User.extend(user);

			return user;

        },

        getUsers: function() {

        	var users = [];

        	for (var key in localStorage){

				if(key.substring(0, prefix.length+3) === ("ls." + prefix)) {

					var user = localStorageService.get(key.substring(3, key.length));

        			if(user) {
						User.extend(user);
        				users[users.length] = user;
        			}

        		}

        	}

    		return users;

        }

    };
	
}]);
