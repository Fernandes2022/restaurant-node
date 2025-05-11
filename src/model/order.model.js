const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
 customer: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
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
 payment: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Payment',
 },
 totalItem: Number,
 totalPrice: Number,

});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;