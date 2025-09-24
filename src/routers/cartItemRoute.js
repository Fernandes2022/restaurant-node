const express = require('express');
const router = express.Router();
const {authenticate, identifyCustomer} = require('../middleware/authentication');


const {
 updateCartItemQuantity,
 removeFromCart,
} = require('../controllers/cartController');


router.put('/update', identifyCustomer, updateCartItemQuantity);
router.delete('/:id/remove', identifyCustomer, removeFromCart);


module.exports = router;