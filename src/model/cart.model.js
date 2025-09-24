const mongoose = require('mongoose');

const CartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  guestId: {
    type: String,
  },
  items: [{
   type: mongoose.Schema.Types.ObjectId,
   ref: 'CartItem',
  }],
  deliveryType: {
    type: String,
    enum: ['IN_CAMPUS', 'OFF_CAMPUS'],
    default: 'IN_CAMPUS'
  },
  deliveryFee: {
    type: Number,
    default: 300
  },
  totalPrice: Number,
  totalItems: Number,
  total: Number
})

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;