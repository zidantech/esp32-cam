const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware to handle raw image data
app.use(bodyParser.raw({ type: 'image/jpeg', limit: '10mb' }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to receive image data from ESP32-CAM
app.post('/upload', (req, res) => {
  const imageData = req.body; // Raw image data
  if (!imageData) {
    return res.status(400).send('No image data received');
  }

  // Save the image to a file
  const imagePath = path.join(__dirname, 'public', 'latest.jpg');
  fs.writeFile(imagePath, imageData, (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).send('Error saving image');
    }
    console.log('Image saved successfully');
    res.status(200).send('Image received and saved');
  });
});

// Endpoint to serve the latest image to clients
app.get('/image', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'latest.jpg');
  res.sendFile(imagePath);
});

// Serve the HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});