## WebSocket Chatroom

A simple live chatroom using WebSocket. It doesn't check IP for the testing convenience, so you can run it in different browser tabs and see what happens~

Client: Use HTML5 WebSocket API.

Server: Use [WebSocket-Node](https://github.com/theturtle32/WebSocket-Node) to provide basic server support for WebSocket.

### How to Run

```bash
npm i
node server.js # node 4.x+ required
```

Then visit website showed in terminal / CMD.

### Notes

1. `innerText` is not supported by Firefox (<= 44), use `textContent` should be better (IE > 8) if there is only text rather than html.
2. There are some interesting differences between `keypress` and `keyup` / `keydown`. I'll talk about this later in [pitfalls](https://github.com/daix6/pitfalls)
