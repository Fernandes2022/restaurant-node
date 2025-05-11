const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  items: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'CartItem',
  }],
  totalPrice: Number,
  totalDiscountedPrice: Number,
  totalItems: Number,
  discount: Number,
  total: Number
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;