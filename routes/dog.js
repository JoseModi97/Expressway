const express = require('express');
const axios = require('axios');

const router = express.Router();

// GET random dog image
router.get('/random', async (req, res, next) => {
  try {
    const response = await axios.get('https://dog.ceo/api/breeds/image/random');
    res.json({
      message: response.data.message,
      status: response.data.status
    });
  } catch (error) {
    console.error('Error fetching dog image:', error);
    // Pass the error to the next error-handling middleware
    next(error);
  }
});

// GET batch of random dog images
router.get('/random-batch', async (req, res, next) => {
  const count = parseInt(req.query.count, 10) || 9; // Default to 9 images if count is not provided or invalid
  const promises = [];

  for (let i = 0; i < count; i++) {
    promises.push(axios.get('https://dog.ceo/api/breeds/image/random'));
  }

  try {
    const responses = await Promise.all(promises);
    const images = responses.map(response => response.data.message);
    res.json({
      images: images,
      status: 'success'
    });
  } catch (error) {
    console.error('Error fetching batch of dog images:', error);
    // If any of the promises reject, Promise.all will reject.
    // We pass this error to the Express error handler.
    next(error);
  }
});

module.exports = router;
