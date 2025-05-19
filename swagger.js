const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

// Get the current environment
const isProduction = process.env.NODE_ENV === 'production';
const localServerUrl = `http://localhost:${process.env.PORT || 3000}`;
const productionServerUrl = process.env.RENDER_EXTERNAL_URL || 'https://cse-341-web-services-dr.onrender.com';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts with full CRUD operations',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: productionServerUrl,
        description: 'Production server'
      },
      {
        url: localServerUrl,
        description: 'Development server'
      }
    ],
    tags: [
      {
        name: 'contacts',
        description: 'Contact operations'
      }
    ],
    components: {
      schemas: {
        Contact: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'favoriteColor', 'birthday'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
              description: 'Auto-generated MongoDB ID'
            },
            firstName: {
              type: 'string',
              example: 'John',
              minLength: 2,
              maxLength: 50
            },
            lastName: {
              type: 'string',
              example: 'Doe',
              minLength: 2,
              maxLength: 50
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
              pattern: '^\\S+@\\S+\\.\\S+$'
            },
            favoriteColor: {
              type: 'string',
              example: 'blue',
              description: 'CSS color name or hex value'
            },
            birthday: {
              type: 'string',
              format: 'date',
              example: '1990-01-01',
              description: 'ISO date format (YYYY-MM-DD)'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              readOnly: true
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Not Found'
            },
            message: {
              type: 'string',
              example: 'Contact not found'
            },
            statusCode: {
              type: 'integer',
              example: 404
            }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: [
    path.join(__dirname, './routes/*.js'),
    path.join(__dirname, './models/*.js')
  ]
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  // Serve Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customSiteTitle: 'Contacts API Documentation',
    customCss: '.swagger-ui .topbar { display: none }',
    customfavIcon: '/public/favicon.ico'
  }));

  // Serve raw JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  console.log(`Swagger docs available at ${isProduction ? productionServerUrl : localServerUrl}/api-docs`);
};