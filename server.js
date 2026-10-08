const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// Serve static files from the current folder
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;
const MAX_PLAYERS = 12;
let players = {};

io.on('connection', (socket) => {
  if (Object.keys(players).length >= MAX_PLAYERS) {
    socket.emit('server_full', 'Server is full. Please try again later.');
    socket.disconnect();
    return;
  }

  console.log('Player joined ' + socket.id);

  players[socket.id] = { id: socket.id, x: 500, y: 500 };
  io.emit('updatePlayers', players);

  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      io.emit('updatePlayers', players);
    }
  });

  socket.on('disconnect', () => {
    console.log('Player left ' + socket.id);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

http.listen(PORT, () => {
  console.log('Naruto IO server running on port ' + PORT);
});
