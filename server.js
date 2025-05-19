// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const swaggerSetup = require('./swagger');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/contactsDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Import routes
const mainRouter = require('./routes');

// Mount routes
app.use('/', mainRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

swaggerSetup(app);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Try accessing: http://localhost:${PORT}/contacts`);
});

try {
  const swaggerSetup = require('./swagger');
  swaggerSetup(app);
} catch (err) {
  console.log('Swagger documentation disabled in production');
}