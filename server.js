require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

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
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
    servers: [{
      url: 'https://cse-341-web-services-dr.onrender.com',
      description: 'Production server'
    }],
  },
  apis: [path.join(__dirname, './routes/*.js')],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'API is running',
    docs: 'https://cse-341-web-services-dr.onrender.com/api-docs'
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Docs: https://cse-341-web-services-dr.onrender.com/api-docs`);
});