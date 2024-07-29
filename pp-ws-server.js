// import { WebSocketServer } from "ws";

// // Change this to work off of a websocket URL in an environment file when deploying!
// const server = new WebSocketServer({ port: 8081 });

import fs from 'fs';
import https from 'https';
import WebSocket, { WebSocketServer } from 'ws';

const server = https.createServer({
	cert: fs.readFileSync('/etc/letsencrypt/live/websocket.pokerparty.click/fullchain.pem'),
	key: fs.readFileSync('/etc/letsencrypt/live/websocket.pokerparty.click/privkey.pem')
});

const wss = new WebSocketServer({ server });

wss.on("connection", function connection(ws) {
	ws.on("error", console.error);

	ws.on("message", (message) => {
		console.log("%s", message);

		wss.clients.forEach((client) => {
			if (client !== ws) {
				client.send("" + message);
			}
		})
	});

	ws.on("connection", function message(conn) {
		console.log("received: %s", conn);
	});

});

server.listen(8081, () => {
	console.log('Server is listening on port 8081. Traffic from port 443 is being redirected to port 8081 by nginx');
});
