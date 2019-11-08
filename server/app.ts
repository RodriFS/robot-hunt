import server from "./";
const io = require("socket.io")(server);
const uiid = require("uuid");

let players = [];
let waitingGeneric = {
  waiting: true,
  message: "Waiting for second player...",
  room: undefined,
  reconnect: undefined,
};

io.on("connect", (socket) => {
  console.log(socket);

  players.push(socket);

  socket.on("waiting", (message) => {
    console.log(message);
    socket.emit("waiting", waitingGeneric);
    if (players.length > 1) {
      let player = players.shift();
      let roomID: string = getID();
      let waiting = {
        waiting: false,
        message: "Conection established...",
        room: roomID,
      };
      socket.emit("waiting", waiting);
      player.emit("waiting", waiting);
      socket.join(roomID);
      player.join(roomID);

      players = [];

      socket.on("start", (message) => {
        io.in(roomID).emit("start", message);
      });
      player.on("start", (message) => {
        io.in(roomID).emit("start", message);
      });

      socket.on("keyboardCoordinates", (message) => {
        io.in(roomID).emit("keyboardCoordinates", message);
      });
      player.on("keyboardCoordinates", (message) => {
        io.in(roomID).emit("keyboardCoordinates", message);
      });

      socket.on("mouseCoordinates", (message) => {
        io.in(roomID).emit("mouseCoordinates", message);
      });
      player.on("mouseCoordinates", (message) => {
        io.in(roomID).emit("mouseCoordinates", message);
      });

      socket.on("disconnect", () => {
        let waiting = {
          waiting: true,
          message: "Player disconected, Waiting for another player...",
          reconnect: true,
        };
        io.to(roomID).emit("waiting", waiting);
        players = [];
        player.disconnect();
        socket.disconnect();
      });

      player.on("disconnect", () => {
        let waiting = {
          waiting: true,
          message: "Player disconected, Waiting for another player...",
        };
        io.to(roomID).emit("waiting", waiting);
        players = [];
        socket.disconnect();
        player.disconnect();
      });
    }
  });

  socket.on("disconnect", () => {
    players = players.filter((s) => s.id !== socket.id);
  });
});

function getID(): string {
  return uiid();
}
