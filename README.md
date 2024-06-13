# pokerparty-ws-server

### Back-end websocket server for Pokerparty
### Instructions for running locally
* clone repo
* run `npm install`
* run `node pp-ws-server.js`
* launch front-end app [here](https://github.com/krishnakatakota/pokerparty-app)

### Websocket Crash Course!
The back-end of this is extremely simple. 
All it does is:
* create a WebSocketServer object called server, which handles all the connections' port routing stuff
* listen for connections on port 8080 (as specified in line 4 of pp-ws-server.js) 
* receive a request as a plain string
* determine if the request is a gamestate or a player join request by seeing if the string "playerList" is in it. Since all of our websocket requests are purely text strings, and since the playerList is only in the gameState, we can determine if a request is a gamestate or a player join request using this method. Very hacky and probably stupid, but I am not a network wizard and this works so I'm ok with this, at least for now.
* broadcast the received message to all clients, including the client that sent the request in the first place (I think this can be used later to confirm request deliveries)

I would recommend reading this site here that explains the [npm ws package](https://www.npmjs.com/package/ws) if you want to understand the different "server.clients.blahblah" on line 17. Also contains some useful stuff for pinging clients and detecting any disconnects.

You can ignore the containsPLString() function. It's a hacky stupid thing I did to ensure you can detect the "playerList" substring in gamestate transmissions, since it wasn't working as an inline condition at line 18. Genuinely perplexed as to why it wasn't working there and I did not care enough to debug this. If you wanna change it go ahead but I mean it works sooooooo... lol!
