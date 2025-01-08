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

const wss = new WebSocketServer({ 
    server,
    verifyClient: (info, callback) => {
        console.log('Incoming connection attempt:', {
            origin: info.origin,
            secure: info.secure,
            req: {
                headers: info.req.headers,
                url: info.req.url
            }
        });

        const allowedOrigins = [
            'https://www.pokerparty.click',
            'https://pokerparty.click',
            'http://localhost:4200'
        ];
        
        const origin = info.origin;
        if (!origin) {
            console.log('Accepted connection with no origin (likely Postman)');
            return callback(true);
        }
        
        if (!allowedOrigins.includes(origin)) {
            console.log('Rejected WebSocket connection from origin:', origin);
            return callback(false);
        }
        console.log('Accepted WebSocket connection from origin:', origin);
        return callback(true);
    }
});

// Add server-level error logging
server.on('error', (error) => {
    console.error('HTTPS Server error:', error);
});

wss.on('error', (error) => {
    console.error('WebSocket Server error:', error);
});

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
