const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static('public'));

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    console.log('Received image data');
    const imageData = message; // Raw image data

    if (!imageData || imageData.length === 0) {
      console.error('No image data received');
      return;
    }

    // Save the image to a file
    const imagePath = path.join(__dirname, 'public', 'latest.jpg');
    fs.writeFile(imagePath, imageData, (err) => {
      if (err) {
        console.error('Error saving image:', err);
        return;
      }
      console.log('Image saved successfully');
    });
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});