const express = require('express');
const router = express.Router();
const {authenticate, identifyCustomer} = require('../middleware/authentication');


const {
 addToCart,
  findUserCart,
  calculateCartTotalController,
  clearingCart,
  deliveryTypeController
} = require('../controllers/cartController');


router.put('/add', identifyCustomer, addToCart);
router.get('/total', identifyCustomer, calculateCartTotalController);
router.get('/', identifyCustomer, findUserCart);
router.put('/clear', identifyCustomer, clearingCart);
router.put('/delivery-type', identifyCustomer, deliveryTypeController);

module.exports = router;

