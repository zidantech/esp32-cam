const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON and URL-encoded data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static('public'));

// Endpoint to receive image data
app.post('/upload', (req, res) => {
  const imageData = req.body.image; // Base64 encoded image
  if (!imageData) {
    return res.status(400).send('No image data received');
  }

  // Decode and save the image
  const buffer = Buffer.from(imageData, 'base64');
  const imagePath = path.join(__dirname, 'public', 'latest.jpg');
  fs.writeFile(imagePath, buffer, (err) => {
    if (err) {
      console.error('Error saving image:', err);
      return res.status(500).send('Error saving image');
    }
    console.log('Image saved successfully');
    res.status(200).send('Image received and saved');
  });
});

// Endpoint to serve the latest image
app.get('/image', (req, res) => {
  const imagePath = path.join(__dirname, 'public', 'latest.jpg');
  res.sendFile(imagePath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});