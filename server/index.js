const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

let players = [];

io.on('connection', (socket) => {

  console.log('user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('players', (message) => {
    if (message.player === 'player1' && message.status === true) {
      players.push({players: message});
    }
    if (message.player === 'player2' && message.status === true) {
      players.push({players: message});
    }
    console.log('Got: ', message);
    io.emit('start', message);
  });

  socket.on('gameStart', (message) => {
    io.emit('gameStart', players);
  });

  socket.on('coordinates', (message) => {
    io.emit('coordinates', message);
  });





});

server.listen(5000, () => {
    console.log('started on port 5000');
});
