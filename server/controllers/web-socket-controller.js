'use strict';

/**
 * Which websocket plugin for node to use?
 * http://stackoverflow.com/questions/16392260/which-websocket-library-to-use-with-node-js
 */

class WebSocketController {
	constructor(session) {
		this.setServerRunning(false);
	}

	startServer () {
		const WebSocketServer = require('websocket').server,
			http = require('http');

		let socket;

		//WS options: https://github.com/theturtle32/WebSocket-Node/blob/master/docs/WebSocketServer.md
		try {
			socket = new WebSocketServer({
				httpServer: http.createServer().listen(8888),
				autoAcceptConnections: false
			});
		}
		catch (e) {
			console.dir(e);
		}

		socket.on('close', (a) => {
			console.log('Websocket connection closed');
			console.dir(a);
		});

		/**
		 * If autoAcceptConnections is set to false, a request event will be emitted by the server
		 * whenever a new WebSocket request is made. You should inspect the requested protocols and
		 * the user's origin to verify the connection, and then accept or reject it by calling
		 * webSocketRequest.accept('chosen-protocol', 'accepted-origin') or webSocketRequest.reject()
		 */
		socket.on('request', (request) => {
			//TODO Only accept white-listed URLS
			//TODO Create a white-list of urls in config
			var connection = request.accept(null, request.origin);

			connection.on('message', (message) => {
				this.receiveMessage(message, connection);
			});

			connection.on('close', (connection) => {
				console.log('Connection closed');
				console.dir(connection);
			});
		});
	}
	
	receiveMessage (message, connection) {
		//message obj -> { type: 'utf8', utf8Data: 'hello from the client' }
		//connection.sendUTF(JSON.stringify(message.utf8Data));
	
		//echo client's message
		//connection.sendUTF(message.utf8Data);
	
		try {
			let msgParsed = JSON.parse(message.utf8Data),
				payload = JSON.stringify(msgParsed);
			
			//msgParsed.method = msgParsed.method.slice(0, -2);
			
			if (typeof this[msgParsed.method] === 'undefined') {
				console.log('No method in payload.')
				return;
			}

			this[msgParsed.method].apply(this, [msgParsed, connection]);
		}
		catch(e) {
			console.error('Payload JSON is malformed');
			console.dir(e);
		}
	}
	
	testMethod (payload, connection) {
		const returnObj = {
			method: payload.method,
			value: 'This is just a test'
		};

		connection.sendUTF(JSON.stringify(returnObj));
	}
	
	getCcInfo (payload, connection) {
		const returnObj = {
			method: payload.method,
			value: 'Get credit card info',
			ccNum: '4111111111111111',
			expDate: '09/22'
		};

		connection.sendUTF(JSON.stringify(returnObj));
	}
	
	getUserInfo (payload, connection) {
		const returnObj = {
			method: payload.method,
			value: 'Get user info',
			loginName: 'webdevinci@gmail.com',
			firstName: 'Tommy',
			lastName: 'Williams'
		};
		
		connection.sendUTF(JSON.stringify(returnObj));
	}
	
	getAvatar (payload, connection) {
		const returnObj = {
			method: payload.method,
			value: 'Get Avatar',
			preset: 'Y',
			avatarName: 'business-admin'
		};
		
		connection.sendUTF(JSON.stringify(returnObj));
	}
	
	getLunch (payload, connection) {
		const lunches = ['Meatloaf sandwich', 'Carrots', 'Apple', 'Sushi', 'Worms', 'Animal Fries'],
			returnObj = {
			method: payload.method,
			value: lunches[Math.round(Math.random()*10%6)]
		};
		connection.sendUTF(JSON.stringify(returnObj));
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

module.exports = WebSocketController;