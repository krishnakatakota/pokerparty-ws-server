// import { WebSocketServer } from "ws";

// // Change this to work off of a websocket URL in an environment file when deploying!
// const server = new WebSocketServer({ port: 8081 });

import fs from 'fs';
import https from 'https';
import WebSocket, { WebSocketServer } from 'ws';

const server = https.createServer({
	cert: fs.readFileSync('/etc/letsencrypt/live/pokerparty.click/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/pokerparty.click/privkey.pem')
});

const wss = new WebSocket.Server({ server });

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("message", (message) => {
		console.log("%s", message);

		var messageString = new String(message.toString());

		wss.clients.forEach((client) => {
			var containsPLStringResult = containsPLString(messageString);

			console.log(containsPLStringResult);
			if (containsPLStringResult) {
				// 0 means game state update
				if (client !== ws) {
					client.send("0:" + message);
				}
			} else {
				// 1 means player join request
				if (client !== ws) {
					client.send("1:" + message);
				}
			}
		})
	});

	ws.on("connection", function message(conn) {
		console.log("received: %s", conn);
	});

});

server.listen(8081, () => {
	console.log('Server is listening on port 8081');
});

function containsPLString(str) {
	var plString = "playerList";
	if (str.indexOf(plString) !== -1) {
		return true;
	} else {
		return false;
	}
}
