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
    // Add CORS verification
    verifyClient: (info) => {
        const allowedOrigins = [
            'https://www.pokerparty.click',
            'https://pokerparty.click',
            'http://localhost:4200'
        ];
        
        const origin = info.origin;
        // Allow connections with no origin (like Postman)
        if (!origin) {
            console.log('Accepted connection with no origin (likely Postman)');
            return true;
        }
        
        if (!allowedOrigins.includes(origin)) {
            console.log('Rejected WebSocket connection from origin:', origin);
            return false;
        }
        console.log('Accepted WebSocket connection from origin:', origin);
        return true;
    }
});

server.listen(8081, () => {
	console.log('Server is listening on port 8081. Traffic from port 443 is being redirected to port 8081 by nginx');
});
