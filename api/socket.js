import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { spiderSearch } from './get_sources.js';
import { groqResponse } from './groq.js';
import { openaiResponse } from './openai.js';

// Create __dirname equivalent for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
      const searchResults = await spiderSearch(query);
      console.log(searchResults);
      // Emit the search results to the client
      socket.emit('search-results', searchResults);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});