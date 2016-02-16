app.service('NodeLocalStorage', [function(){

	'use strict';

	const userDataPath = require('electron').remote.getGlobal("userDataPath");
	const LocalStorage = require('electron').remote.require('node-localstorage').LocalStorage;
	var nodeLocalStorage = new LocalStorage(userDataPath);

	return {

		/**
    	 * @memberOf SessionPreferences
    	 * necessary on the first function to show Outline view in Eclipse
         */
    	id: 'NodeLocalStorage',

		add: function(key, value) {

    		return nodeLocalStorage.setItem(key, value);

        },

        get: function(key) {

    		return nodeLocalStorage.getItem(key);

        },

        remove: function(key) {

    		return nodeLocalStorage.removeItem(key);

        },

        clearAll: function(key) {

    		return nodeLocalStorage.clear(key);

        },


    };

}]);
