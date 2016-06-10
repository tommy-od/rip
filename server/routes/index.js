module.exports = function(app) {
	'use strict';

	let WebSocketController = require('../controllers/web-socket-controller.js');

	app.route('/').get(function (req, res, next) {
		let wsc = new WebSocketController();
		wsc.startServer();

		res.render('index', {
			title: 'REST in peace - RIP'
		});
	});
};