const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {
 addToCart,
  findUserCart,
  calculateCartTotalController,
  clearingCart,
  setDeliveryType
} = require('../controllers/cartController');


router.put('/add', authenticate, addToCart);
router.get('/total', authenticate, calculateCartTotalController);
router.get('/', authenticate, findUserCart);
router.put('/clear', authenticate, clearingCart);
router.put('/delivery-type', authenticate, setDeliveryType);

module.exports = router;

