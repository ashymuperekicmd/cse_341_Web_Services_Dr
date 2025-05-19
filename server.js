require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Constants setup
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = isProduction 
  ? 'https://cse-341-web-services-dr.onrender.com' 
  : `http://localhost:${PORT}`;

// Middleware
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
const contactsRouter = require('./routes/contacts');
app.use('/contacts', contactsRouter);

// Swagger Documentation
let swaggerEnabled = true;
try {
  const swaggerSetup = require('./config/swagger');
  swaggerSetup(app);
  console.log('Swagger documentation enabled');
} catch (err) {
  swaggerEnabled = false;
  console.log('Swagger documentation disabled:', err.message);
}

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    docs: `${API_BASE_URL}/api-docs`,
    environment: isProduction ? 'production' : 'development'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`REST API: ${API_BASE_URL}/contacts`);
  
  if (swaggerEnabled) {
    console.log(`API Documentation:`);
    console.log(`- Local: http://localhost:${PORT}/api-docs`);
    console.log(`- Production: https://cse-341-web-services-dr.onrender.com/api-docs`);
    console.log(`- JSON Spec: ${API_BASE_URL}/api-docs.json`);
  }
});