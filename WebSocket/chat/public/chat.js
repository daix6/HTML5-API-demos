window.onload = function _documentonload() {
  var chatroom = document.getElementById('chat');
  var input = document.getElementsByClassName('input')[0];
  var count = document.getElementById('count');

  var socket = new WebSocket('ws://localhost:8080', ['chat'])

  socket.onerror = function _onerror(e) {
    console.log(e);
    console.log('Connection error.');
  };

  socket.onopen = function _onopen(e) {
    console.log('Connected.');
  };

  socket.onclose = function _onclose(e) {
    console.log('Disconnected.');
  }

  socket.onmessage = function _onmessage(e) {
    var message = JSON.parse(e.data);
    if (message.type === 'Info' || message.type === 'Error') {
      chatroom.appendChild(createToast(message.data));
      chatroom.scrollTop = 0xffff;
    } else if (message.type === 'Chat') {
      chatroom.appendChild(createMessage(message.data));
      chatroom.scrollTop = 0xffff;
    } else if (message.type === 'Count')
      count.textContent = message.data;
    else
      return;
  }

  document.addEventListener('keypress', function (e) {
    if (socket.readyState === WebSocket.OPEN &&
      e.ctrlKey &&
      (e.which === 13 || e.which === 10)) {
        var message = {
          type: 'Chat',
          data: input.value
        };
        chatroom.appendChild(createMessage(message.data, true));
        chatroom.scrollTop = 0xffff;
        input.value = '';
        socket.send(JSON.stringify(message));
    }
  });
};

function createToast(content) {
  var message = document.createElement('div');
  message.setAttribute('class', 'message toast');
  var toast = document.createElement('span');
  toast.textContent = content;
  message.appendChild(toast)
  return message;
}

function createMessage(content, self) {
  var message = document.createElement('div');
  message.setAttribute('class', self ? 'message self' : 'message other');
  var bubble = document.createElement('span');
  bubble.setAttribute('class', 'bubble');
  bubble.textContent = content;
  message.appendChild(bubble)
  return message;
}
