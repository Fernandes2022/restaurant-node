// process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
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

module.exports = { app };
