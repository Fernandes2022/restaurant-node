const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {
 updateCartItemQuantity,
 removeFromCart,
} = require('../controllers/cartController');


router.put('/update', authenticate, updateCartItemQuantity);
router.delete('/:id/remove', authenticate, removeFromCart);


module.exports = router;