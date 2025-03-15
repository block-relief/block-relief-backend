const swaggerJsdoc = require('swagger-jsdoc');
const { config } = require('./src/config/config')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Block Relief',
      version: '1.0.0',
      description: 'API documentation for Block-Relief',
    },
    servers: [
      {
        url: config.BASEURL || "http://localhost:5000/",
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/swaggerRoutes/*.js'], 
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
