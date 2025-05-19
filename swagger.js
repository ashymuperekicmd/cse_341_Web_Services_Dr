// config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts'
    },
    servers: [{
      url: 'https://cse-341-web-services-dr.onrender.com',
      description: 'Production server'
    }]
  },
  apis: [path.join(__dirname, '../routes/*.js')]
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  // Serve Swagger UI at /api-docs
  app.use('/api-docs', 
    swaggerUi.serve, 
    swaggerUi.setup(specs, {
      customSiteTitle: "Contacts API Documentation",
      customfavIcon: "/favicon.ico",
      customCss: '.swagger-ui .topbar { display: none }'
    })
  );
  
  // Also expose the raw spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};