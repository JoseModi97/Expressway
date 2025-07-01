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

module.exports = router;
