const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);



io.on('connection', (socket) => {

  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('message', (message) => {
    console.log('Message Received: ', message);
    io.emit('message', {type: 'new-message', text: message});
  });
});

server.listen(5000, () => {
    console.log('started on port 5000');
});
