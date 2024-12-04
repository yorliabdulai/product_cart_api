const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shopping Cart API',
      version: '1.0.0',
      description: 'API for managing products and shopping carts',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Product: {
          type: 'object',
          properties: {
            id: { type: 'string', description: 'The product ID' },
            name: { type: 'string', description: 'The product name' },
            category: { type: 'string', description: 'The product category' },
            price: { type: 'number', description: 'The product price' },
            image: {
              type: 'object',
              properties: {
                thumbnail: { type: 'string', description: 'Thumbnail image URL' },
                mobile: { type: 'string', description: 'Mobile image URL' },
                tablet: { type: 'string', description: 'Tablet image URL' },
                desktop: { type: 'string', description: 'Desktop image URL' },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Ensure your routes are well-documented
};

const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = setupSwagger;
