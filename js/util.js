Array.prototype.contains = function(elm) {
	for (var i = 0; i < this.length; i++) {
		if (elm == this[i]) return true;
	}
	return false;
};

Array.prototype.random = function() {
	return this[Math.floor(Math.random() * this.length)];
};