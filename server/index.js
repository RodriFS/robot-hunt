const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const uiid = require('uuid');
const cors = require('cors');

app.use(cors);

let players = [];
let playerNum;

io.on('connect', socket => {
  players.push(socket);

  socket.on('waiting', message => {
    let waiting = { waiting: true, message: 'Waiting for second player...' };
    socket.emit('waiting', waiting);

    if (players.length > 1) {
      let player = players.shift();
      let roomID = getID();
      waiting = {
        waiting: false,
        message: 'Conection established...',
        room: roomID
      };
      socket.emit('waiting', waiting);
      player.emit('waiting', waiting);
      socket.join(roomID);
      player.join(roomID);

      players = [];

      socket.on('start', message => {
        io.in(roomID).emit('start', message);
      });
      player.on('start', message => {
        io.in(roomID).emit('start', message);
      });

      socket.on('keyboardCoordinates', message => {
        io.in(roomID).emit('keyboardCoordinates', message);
      });
      player.on('keyboardCoordinates', message => {
        io.in(roomID).emit('keyboardCoordinates', message);
      });

      socket.on('mouseCoordinates', message => {
        io.in(roomID).emit('mouseCoordinates', message);
      });
      player.on('mouseCoordinates', message => {
        io.in(roomID).emit('mouseCoordinates', message);
      });

      socket.on('disconnect', () => {
        waiting = {
          waiting: true,
          message: 'Player disconected, Waiting for another player...',
          reconnect: true
        };
        io.to(roomID).emit('waiting', waiting);
        players = [];
        player.disconnect();
        socket.disconnect();
      });

      player.on('disconnect', () => {
        waiting = {
          waiting: true,
          message: 'Player disconected, Waiting for another player...'
        };
        io.to(roomID).emit('waiting', waiting);
        players = [];
        socket.disconnect();
        player.disconnect();
      });
    }
  });

  socket.on('disconnect', () => {
    waiting = {
      waiting: true,
      message: 'Player disconected, Waiting for another player...'
    };
    players = players.filter(s => s.id !== socket.id);
  });
});

function getID() {
  return uiid();
}

server.listen(5000, () => {
  console.log('started on port 5000');
});
