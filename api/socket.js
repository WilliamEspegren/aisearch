import express from 'express';
import { createServer } from 'http';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { spiderSearch } from './get_sources.js';
import { getAnswer } from './get_answer.js';

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
    if (!query) {
      socket.emit('error', { error: 'Query parameter is required' });
      return;
    }

    try {
      const searchResults = await spiderSearch(query);
      // Emit the search results to the client
      socket.emit('search-results', searchResults);

      // Turn the search results into a single string
      const scrapedContent = searchResults.content.map(result => `Title: ${result.title}\nDescription: ${result.description}\n\n`).join(' ');
      
      // Use getAnswer to get the response
      const answerGenerator = await getAnswer(scrapedContent, query, 'groq');
      
      // Stream the response
      for await (const chunk of answerGenerator) {
        socket.emit('answer-chunk', chunk);
      }
    } catch (error) {
      console.error('Error:', error);
      socket.emit('error', { error: "Internal server error" });
    }
  });
});

server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});