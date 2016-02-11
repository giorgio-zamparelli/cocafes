function User() {

	User.initialize(this);

}

User.initialize = function(user) {

	if(user) {

		if (!user.creationTime) {
			user.creationTime = 0;
		}

		if (!user.lastEditTime) {
			user.lastEditTime = 0;
		}

	}

};

User.extend = function(user) {

	if(user) {

		User.initialize(user);

		user.__proto__ = User.prototype;

	}

	return user;

};

User.clone = function(user) {

	var clonedUser;

	if(user) {

		clonedUser = JSON.parse(JSON.stringify(user));
		User.extend(clonedUser);

	}

	return clonedUser;

};
