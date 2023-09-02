// server.mjs
import express from 'express';
import { readFile } from 'fs/promises'; // Import the built-in 'fs' module for file operations

const app = express();
const port = 8080;

// Serve static files, including JavaScript modules
app.use(express.static('public', { extensions: ['html', 'js', 'mjs', 'css'] }));

// Define a route to handle module requests with the correct content type
app.get('/your-module.mjs', async (req, res) => {
  try {
    const moduleContent = await readFile('game.mjs', 'utf-8');
    res.type('application/javascript').send(moduleContent);
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
