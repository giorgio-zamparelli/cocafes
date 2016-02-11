app.service('UsersStorage', ['NodeLocalStorage', function(NodeLocalStorage){

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

    		return NodeLocalStorage.add(prefix + user._id, user) ? user._id : undefined;

        },

		contains: function(userId) {

			return NodeLocalStorage.get(prefix + userId) ? true : false;

		},

        deleteUser: function(userId) {

			var user = this.getUser(userId);

			if (user) {

				NodeLocalStorage.remove(prefix + userId);

			} else {

				userId = undefined;

			}

			return userId;

        },

    	getUser: function(userId) {

			var user = NodeLocalStorage.get(prefix + userId);

			User.extend(user);

			return user;

        },

        getUsers: function() {

        	var users = [];

        	for (var key in localStorage){

				if(key.substring(0, prefix.length+3) === ("ls." + prefix)) {

					var user = NodeLocalStorage.get(key.substring(3, key.length));

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
