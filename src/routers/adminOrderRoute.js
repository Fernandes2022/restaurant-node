const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');



const {
 cancelOrderController,
  getOrdersOfRestaurantController,
  updateOrderStatusController,
  createOrderController,
  getUserOrdersController
} = require('../controllers/orderController');



router.delete('/:orderId', authenticate, cancelOrderController);
router.get('/restaurant/:restaurantId', authenticate, getOrdersOfRestaurantController);
router.put('/:orderId/:orderStatus', authenticate, updateOrderStatusController);


module.exports = router;