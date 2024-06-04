import 'dotenv/config';
import express from 'express';
import { apiRouter } from './db/api/index.js';
import { authRouter } from './db/auth/index.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for serving front end
for (const path of ["/", "/login", "/register", "/game", "/board", "/admin", "/info", "/profile"]) {
  app.use(path, express.static("./dist"));
}

app.get("/", (req, res, next) => {
  res.sendFile(__dirname + "/dist/index.html");
});

// Backend API paths
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Real-time player data
const players = {};

io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Add new player
  players[socket.id] = {
    id: socket.id,
    x: 50,
    y: 900,
    sprite: 'duck'
  };

  // Send the current state of players to the new player
  socket.emit('currentPlayers', players);

  // Broadcast a new player to all other players
  socket.broadcast.emit('newPlayer', players[socket.id]);

  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
    delete players[socket.id];
    io.emit('disconnect', socket.id);
  });

  socket.on('playerMovement', (movementData) => {
    if (players[socket.id]) {
      players[socket.id].x = movementData.x;
      players[socket.id].y = movementData.y;
      io.emit('playerMoved', players[socket.id]);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});