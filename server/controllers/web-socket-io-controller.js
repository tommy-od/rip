'use strict';



/**
 * Which websocket plugin for node to use?
 * http://stackoverflow.com/questions/16392260/which-websocket-library-to-use-with-node-js
 */

class WebSocketIoController {
	//TODO add session var
	constructor() {
		this.setServerRunning(false);

		var app = require('express')();
		var server = require('http').createServer(app);
		var socket = require('socket.io')(server);

		socket.on('connection', function (conn) {
			socket.emit('welcome', { message: 'Welcome!', id: socket.id });

			socket.on('i am client', console.log);

			console.log('connection on');
			console.dir(conn);
		});
		server.listen(8888);

	}

	startServer () {

	}

	setServerRunning (isServerRunning) {
		this.isServerRunning = isServerRunning;
	}
	isServerRunning () {
		return this.isServerRunning;
	}

	broadcastMessage (data) {

	}

	originIsAllowed(origin) {
		// put logic here to detect whether the specified origin is allowed.
		return true;
	}

	////////////////////////
	// Routing
	////////////////////////

}

module.exports = WebSocketIoController;