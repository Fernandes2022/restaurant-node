const express = require('express');
const router = express.Router();
const {authenticate, authorizeRoles} = require('../middleware/authentication');



const {
 cancelOrderController,
  getOrdersOfRestaurantController,
  updateOrderStatusController,
  createOrderController,
  getUserOrdersController
} = require('../controllers/orderController');



router.delete('/:orderId', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), cancelOrderController);
router.get('/restaurant', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), getOrdersOfRestaurantController);
router.put('/:orderId/:orderStatus', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), updateOrderStatusController);


module.exports = router;