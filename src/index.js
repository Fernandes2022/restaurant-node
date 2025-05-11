// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routers
const homeRouter = require('./routers/homeRoute');
const authRouters = require('./routers/authRouters');
const userRouters = require('./routers/userRoute');
const restaurantRouters = require('./routes/restaurant.routes');
const orderRouters = require('./routers/orderRoute');
const foodRouters = require('./routers/foodRoute');
const adminOrderRouters = require('./routers/adminOrderRoute');
const cartRouters = require('./routers/cartRoute');
const cartItemRouters = require('./routers/cartItemRoute');
const categoryRouters = require('./routers/categoryRoute');
const adminCategoryRouters = require('./routers/categoryRoute');
const adminIngredientRouters = require('./routers/adminIngredientRoute');
const adminEventRouters = require('./routers/adminEventRoute');
const eventRouters = require('./routers/eventRoute');
const adminFoodRouters = require('./routers/adminFoodRoute');
const messageRouters = require('./routers/message.routes');

// Use Routers
app.use('/', homeRouter);
app.use('/auth', authRouters);
app.use('/api/contact', messageRouters);
app.use('/api/user', userRouters);
app.use('/api/restaurants', restaurantRouters);
app.use('/api/order', orderRouters);
app.use('/api/food', foodRouters);
app.use('/api/admin/order', adminOrderRouters);
app.use('/api/cart', cartRouters);
app.use('/api/cart-item', cartItemRouters);
app.use('/api/category', categoryRouters);
app.use('/api/admin/category', adminCategoryRouters);
app.use('/api/admin/ingredients', adminIngredientRouters);
app.use('/api/admin/events', adminEventRouters);
app.use('/api/events', eventRouters);
app.use('/api/admin/food', adminFoodRouters);

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Restaurant API',
      version: '1.0.0',
      description: 'API for restaurant platform',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Local server' },
      {
        url: process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'https://your-vercel-domain.vercel.app',
        description: 'Production server',
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
    security: [{ bearerAuth: [] }],
  },
  apis: [path.join(__dirname, 'docs', 'swaggerDocs.js')],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  explorer: true,
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css',
  customSiteTitle: 'Restaurant API Documentation',
}));

module.exports = { app };
