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

// At the top of your server.js with other constants
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? 'https://cse-341-web-services-dr.onrender.com' 
  : `http://localhost:${PORT}`;

// ... (in your app.listen callback)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`REST API: ${API_BASE_URL}/contacts`);
  
  if (swaggerEnabled) {
    console.log(`API Documentation:`);
    console.log(`- Local: http://localhost:${PORT}/api-docs`);
    console.log(`- Production: https://cse-341-web-services-dr.onrender.com/api-docs`);
    console.log(`- JSON Spec: ${API_BASE_URL}/api-docs.json`);
  } else {
    console.log('Swagger documentation is disabled');
  }
});