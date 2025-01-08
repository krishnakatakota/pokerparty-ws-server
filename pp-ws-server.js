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

server.on('upgrade', (request, socket, head) => {
    console.log('Upgrade request received:', {
        headers: request.headers,
        url: request.url
    });
});

const wss = new WebSocketServer({ 
    server,
    clientTracking: true,
    verifyClient: (info, callback) => {
        console.log('Verification attempt:', {
            origin: info.origin,
            secure: info.secure,
            headers: info.req.headers
        });

        const allowedOrigins = [
            'https://www.pokerparty.click',
            'https://pokerparty.click',
            'http://localhost:4200'
        ];
        
        const origin = info.origin || info.req.headers.origin;
        
        // Allow Postman (no origin) or valid origins
        if (!origin || allowedOrigins.includes(origin)) {
            console.log('Accepting connection from:', origin || 'No origin (Postman)');
            callback(true);
        } else {
            console.log('Rejecting connection from:', origin);
            callback(false);
        }
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
	console.log('New connection established:', {
        headers: request.headers,
        url: request.url
    });

	ws.on("error", (error) => {
        console.error('WebSocket error:', error);
    });

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

	ws.on("close", (code, reason) => {
        console.log('Connection closed:', { code, reason });
    });
});

server.listen(8081, () => {
	console.log('Server is listening on port 8081. Traffic from port 443 is being redirected to port 8081 by nginx');
});
