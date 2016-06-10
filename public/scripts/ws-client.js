//My Files file on OD - myFilesFrameControl.js
const wsClient = (function () {
	const socket = new WebSocket('ws://localhost:8888');

	function init() {
		bindListeners();

		//initSocketIo();
		initWebSocket();
	}

	function bindListeners() {
		var sendToServerBtn = document.getElementById('sendToServerBtn'),
			clientInput = document.getElementById('clientInput');

		sendToServerBtn.addEventListener('click', () => {
			sendMessage(document.getElementById('clientInput').value);
			clientInput.value = '';	
		});

		clientInput.addEventListener('keydown', event => {
			if(event.keyCode === 13) {
				sendToServerBtn.click();
			}
		});

		document.getElementById('clearOutputBtn').addEventListener('click', () => {
			document.getElementById('serverResponse').innerHTML = '';
		});
		
		//Sample json buttons
		for(let btn of document.getElementsByClassName('presetJson')) {
			btn.addEventListener('click', () => {
				clientInput.value = `{"method": "${btn.innerText.substr(0, btn.innerText.length - 2)}"}`;
			});
		}
	}

	function initWebSocket() {
		socket.addEventListener('open', () => {
			document.getElementById('sendToServerBtn').removeAttribute('disabled');
		});

		//Incoming message from server
		socket.addEventListener('message', message => {
			printToPage(`Server: ${message.data}`);
			receiveMessage(message);
		});

		socket.addEventListener('error', error => {
			console.log('WebSocket error: ' + error);
		});
	}

	/**
	 * Send message to node server through websocket
	 * @param msg
	 */
	function sendMessage (msg) {
		printToPage(`Client: ${msg}`);
		socket.send(msg);
	}
	
	/**
	 * receiveMessage: A JSON message will come back from server, if it has a method to call, it will call it.
	 * @param event
	 */
	function receiveMessage (event) {
		/*if(event.origin.indexOf('officedepot.com') < 0){
			return;
		}*/
		try {
			let msgParsed = JSON.parse(event.data),
				payload = JSON.stringify(msgParsed);

			//msgParsed.method = msgParsed.method.slice(0, -2);

			if (typeof wsClient[msgParsed.method] === 'undefined') {
				return;
			}

		}
		catch(e) {
			wsClient[msgParsed.method].apply(wsClient, [msgParsed]);
			console.error('Payload JSON is malformed');
			console.dir(e);
		}
	}

	/**
	 * printToPage: Print any server or client messages to output section of page
	 * @param msg
	 */
	function printToPage(msg) {
		document.getElementById('serverResponse').innerHTML += `${msg}<br>`;
	}

	////////////////////////
	// Methods that will be called from server
	////////////////////////
	function testMethod (msg) {
		console.log(msg.value);
	}

	function getCcInfo (msg) {
		testMethod.call(this, msg);
	}

	function getUserInfo (msg) {
		testMethod.call(this, msg);
	}

	function getAvatar (msg) {
		testMethod.call(this, msg);
	}

	function getLunch (msg) {
		testMethod.call(this, msg);
	}

	////////////////////
	//Socket IO - not impressed
	////////////////////
	function initSocketIo() {
		var socket = io();
		
		socket.on('welcome', function(data) {
			addMessage(data.message);
			
			// Respond with a message including this clients' id sent from the server
			socket.emit('i am client', {data: 'foo!', id: data.id});
		});
		socket.on('time', function(data) {
			addMessage(data.time);
		});
		socket.on('error', console.error.bind(console));
		socket.on('message', console.log.bind(console));
		
		function addMessage(message) {
			var text = document.createTextNode(message),
				el = document.createElement('li'),
				messages = document.getElementById('messages');
			
			el.appendChild(text);
			messages.appendChild(el);
		}
	}

	return {
		init: init,
		testMethod: testMethod
	};
}());

document.addEventListener('DOMContentLoaded', wsClient.init);