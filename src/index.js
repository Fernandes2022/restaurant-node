process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

require('dotenv').config();


const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://nutric.vercel.app',
  'https://timi-restaurant-node.vercel.app' // this is for Swagger UI hosted on same server
];

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url, 'Origin:', req.headers.origin);
  next();
});

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      // Allow requests like curl or Swagger with no Origin header
      callback(null, true);
    } else if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(bodyParser.json());
app.use(express.json());

// Routers
const homeRouter = require('./routers/homeRoute');
const authRouters = require('./routers/authRouters');
const userRouters = require('./routers/userRoute');
const restaurantRouters = require('./routers/restaurantRoute');
const orderRouters = require('./routers/orderRoute');
const foodRouters = require('./routers/foodRoute');
const adminOrderRouters = require('./routers/adminOrderRoute');
const cartRouters = require('./routers/cartRoute');
const cartItemRouters = require('./routers/cartItemRoute');
const categoryRouters = require('./routers/categoryRoute');
const adminCategoryRouters = require('./routers/adminCategoryRoute');
const adminIngredientRouters = require('./routers/adminIngredientRoute');
const adminEventRouters = require('./routers/adminEventRoute');
const eventRouters = require('./routers/eventRoute');
const adminFoodRouters = require('./routers/adminFoodRoute');
const messageRouters = require('./routers/messageRoute');

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

module.exports = { app };
