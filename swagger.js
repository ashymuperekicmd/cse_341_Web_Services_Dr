const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
    servers: [
      {
        url: 'https://your-render-app-url.onrender.com', // Update with your Render URL
        description: 'Production server',
      },
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: {
              type: 'string',
              description: 'Auto-generated contact ID',
            },
            firstName: {
              type: 'string',
              description: 'First name of the contact',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the contact',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the contact',
            },
            favoriteColor: {
              type: 'string',
              description: 'Favorite color in CSS format',
            },
            birthday: {
              type: 'string',
              format: 'date',
              description: 'Birth date in YYYY-MM-DD format',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Auto-generated creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Auto-generated update timestamp',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to your route files
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};