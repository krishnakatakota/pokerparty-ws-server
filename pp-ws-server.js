import { WebSocketServer } from "ws";

// Change this to work off of a websocket URL in an environment file when deploying!
const server = new WebSocketServer({ port: 8081 });

server.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", (message) => {
    console.log("%s", message);

	var messageString = new String(message.toString());

	server.clients.forEach((client) => {
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

function containsPLString(str) {
	var plString = "playerList";
	if (str.indexOf(plString) !== -1) {
		return true;
	} else {
		return false;
	}
}
