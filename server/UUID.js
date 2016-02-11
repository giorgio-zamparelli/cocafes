var UUID = function () {

}

UUID.generate = function() {

	return "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx".replace(/[x]/g, function(c) {
		var r = Math.random() * 16 | 0, v = c === "x" ? r : r & 3 | 8;
		return v.toString(16);
	});

};

module.exports = UUID;
