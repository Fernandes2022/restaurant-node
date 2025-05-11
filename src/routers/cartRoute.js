const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {
 addToCart,
  findUserCart,
  calculateCartTotalController,
  clearingCart
} = require('../controllers/cartController');


router.put('/add', authenticate, addToCart);
router.get('/total', authenticate, calculateCartTotalController);
router.get('/', authenticate, findUserCart);
router.put('/clear', authenticate, clearingCart);


module.exports = router;

