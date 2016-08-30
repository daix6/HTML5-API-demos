'use strict';

const path = require('path');
const http = require('http');
const Koa = require('koa');
const serve = require('koa-static');
const WebSocketServer = require('websocket').server;

const PORT = process.env.PORT || 8080;

/********** HTTP Server Config **********/
const app = new Koa();

// 404
app.use(function* (next) {
  yield next;

  if (this.status != 404) return;

  this.status = 404;
  this.body = 'Not Found';
});

app.use(serve(path.resolve(__dirname, 'public'), { index: 'index.html' }));

const httpServer = http
  .createServer(app.callback())
  .listen(8080, () => {
    console.log('Server is listening on http://localhost:%s', PORT);
  });

/********** WebSocket Config **********/

function validOrigin(origin) {
  if (origin !== 'http://localhost:8080') return false;
  return true;
};

function validProtocol(request, standard) {
  if (request.requestedProtocols.indexOf(standard) === -1)
    return false;
  return true;
}

function generateMessage(type, content) {
  return JSON.stringify({
    type,
    data: content
   });
}

function handleMessage(connection, message) {
  if (!message.type || !message.data)
    return connection.sendUTF(generateMessage('Error', 'Invalid data, wrong format.'));
  
  if (message.type !== 'Chat')
    return connection.sendUTF(generateMessage('Error', 'Invalid data, wrong type.'));

  connections.forEach(item => {
    if (connection === item) return;
    item.sendUTF(generateMessage('Chat', message.data));
  });
}

const socket = new WebSocketServer({
  httpServer
});

const PROTOCOL = 'chat';
const _IP = Symbol(PROTOCOL);

let connections = [];

socket.on('request', function (req) {
  if (!validOrigin(req.origin) || !validProtocol(req, PROTOCOL)) {
    req.reject();
    return;
  }

  const conn = req.accept(PROTOCOL, req.origin);
  conn[_IP] = req.remoteAddress;

  connections.push(conn);

  connections.forEach(item => {
    item.sendUTF(generateMessage('Info', `${conn[_IP]} joined.`));
    item.sendUTF(generateMessage('Count', connections.length));
  });

  console.log('%s connected.', conn[_IP]);

  conn.on('message', function(message) {
    if (message.type !== 'utf8') {
      conn.sendUTF(generateMessage('Error', 'Invalid data, utf8 only.'));
      return;
    }

    try {
      message = JSON.parse(message.utf8Data);
    } catch (e) {
      conn.sendUTF(generateMessage('Error', 'Invalid data, wrong format.'));
      return;
    }

    handleMessage(conn, message);
  });

  conn.on('close', function(code, description) {
    const where = connections.indexOf(conn);
    connections.splice(where, 1);
    console.log('%s disconnected.', conn[_IP]);

    connections.forEach(item => {
      item.sendUTF(generateMessage('Info', `${conn[_IP]} leaved.`));
      item.sendUTF(generateMessage('Count', connections.length));
    });
  });
});
