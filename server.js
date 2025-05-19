// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
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

// Swagger documentation setup
let swaggerEnabled = true;
try {
  const swaggerSetup = require('./swagger');
  swaggerSetup(app);
  console.log('Swagger documentation enabled');
} catch (err) {
  swaggerEnabled = false;
  console.log('Swagger documentation disabled:', err.message);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    swagger: swaggerEnabled
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`REST API: http://localhost:${PORT}/contacts`);
  if (swaggerEnabled) {
    console.log(`API Docs: http://localhost:${PORT}/api-docs`);
  }
});