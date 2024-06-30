const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Serve static files from the "public" directory
app.use(express.static(join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, '../public/index.html'));
});

// Serve the socket.io client library
app.get('/socket.io/socket.io.js', (req, res) => {
  res.sendFile(join(__dirname, '../node_modules/socket.io/client-dist/socket.io.js'));
});

io.on('connection', (socket) => {
  socket.on('query', async (query) => {
    console.log('query: ' + query);
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});
