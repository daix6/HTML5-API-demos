'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocketServer = require('websocket').server;

const PORT = 8080;

const app = http
  .createServer(function(req, res) {
    if (req.url === '/') {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.readFile(path.resolve(__dirname, 'index.html'), 'utf-8', (err, file) => {
        res.write(file);
        res.end();
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
    }
  })
  .listen(PORT, () => {
    console.log('Server listening on http://localhost:%s', PORT);
  });

const socket = new WebSocketServer({
  httpServer: app
});

socket.on('request', function(req) {
  if (req.requestedProtocols.indexOf('fib') === -1) {
    req.reject();
    return;
  }

  let connection = req.accept('fib', req.origin);
  let iid;

  connection.on('message', function(message) {
    console.log(message);
    if (message.type === 'utf8' && message.utf8Data === 'hey') {
      connection.sendUTF('Server: Hello');
      iid = setInterval(() => connection.sendUTF('Server: ' + gen.next().value), 1000);
    } else {
      connection.sendUTF('Invalid data: ' + message.toString());
    }
  });

  connection.on('close', function(reasonCode, description) {
    console.log(reasonCode, description);
    clearInterval(iid);
  });

});

const gen = fibonacci();

function* fibonacci() {
  let [a, b] = [1, 1];
  yield a;
  while (true) {
    [a, b] = [b, a + b];
    yield a;
  }
}
