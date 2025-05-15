const express = require('express');
const router = express.Router();

// Import route modules
const contactsRouter = require('./contacts');

// Basic test route
router.get('/', (req, res) => {
  res.send('Welcome to the Contacts API - try /contacts');
});

// Mount contacts router under /contacts path
router.use('/contacts', contactsRouter);

module.exports = router;