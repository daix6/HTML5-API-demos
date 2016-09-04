## WebSocket Fibonacci

A simple demo using websocket. Client gets next fibonacci number from server per second using WebSocket.

Client: Use HTML5 WebSocket API.

Server: Use [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node) to provide basic server support for WebSocket.

### How to Run

```bash
npm i
node server.js # node 4.x+ required
```

Then visit server.

### Notes

1. For **WebSocket-Node**, you can get user post protocols from `request.requestedProtocols`.
