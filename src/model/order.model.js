const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
 customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
 },
 guestId: {
  type: String,
 },
 restaurant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Restaurant',
 },
 totalAmount: Number,
 orderStatus: String,
 createdAt: {
  type: Date,
  default: Date.now,
 },
 deliveryAddress: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Address',
 },
 items: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'OrderItem',
 }],
 deliveryType: {
  type: String,
  enum: ['IN_CAMPUS', 'OFF_CAMPUS'],
  required: true
},
deliveryFee: {
  type: Number,
  required: true
},
discountAmount: {
  type: Number,
  default: 0
},
 payment: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Payment',
 },
 totalItem: Number,
 totalPrice: Number,
 guestDetails: {
  name: String,
  email: String,
  phone: String,
 },

});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;