'use strict';
let config = require('./config'),
	mongoose = require('mongoose');

module.exports = function() {
	let db = mongoose.connect(config.db);
	return db;
};