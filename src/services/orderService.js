const Address = require('../model/address.model');
const Order = require('../model/order.model');
const OrderItem = require('../model/orderItem.model');
const Restaurant = require('../model/restaurant.model');
const {findCartByUserId, calculateCartTotal, clearCart} = require('./cartService');

const createOrder = async (order, user) => {
 try {
  const address = order.deliveryAddress;
  let savedAddress;
  
  if(!address) {
    throw new Error('Delivery address is required');
  }

  if(address._id) {
   const isAddressExist = await Address.findById(address._id);
   if(isAddressExist) {
    savedAddress = isAddressExist;
   } else {
    const shippingAddress = new Address(address);
    savedAddress = await shippingAddress.save();
   }
  } else {
    const shippingAddress = new Address(address);
    savedAddress = await shippingAddress.save();
  }

  if(!user.addresses.includes(savedAddress._id)) {
    user.addresses.push(savedAddress._id);
    await user.save();
  }

  const restaurant = await Restaurant.findById(order.restaurantId);
  if(!restaurant) {
    throw new Error(`Restaurant not found with Id: ${order.restaurantId}`);
  }

  const cart = await findCartByUserId(user._id);
  if(!cart) {
    throw new Error('Cart not found');
  }

  const orderItems = [];
  for(const cartItem of cart.items) {
    const orderItem = new OrderItem({
      food: cartItem.food,
      quantity: cartItem.quantity,
      totalPrice: cartItem.food.price * cartItem.quantity,
      ingredients: cartItem.ingredients,
    });
    const savedOrderItem = await orderItem.save();
    orderItems.push(savedOrderItem._id);
  }
    
  const totalPrice = await calculateCartTotal(cart);
    
  const createdOrder = new Order({
    customer: user._id,
    restaurant: restaurant._id,
    totalAmount: totalPrice,
    orderStatus: 'PENDING',
    deliveryAddress: savedAddress._id,
    createdAt: new Date(),
    items: orderItems,
  })

  const savedOrder = await createdOrder.save();
  restaurant.orders.push(savedOrder._id);
  await restaurant.save();

  await clearCart(user);

  return savedOrder;
 } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
 }
}


const cancelOrder = async (orderId) => {
  try {
   await Order.findByIdAndDelete(orderId);
  } catch (error) {
    throw new Error(`failed to cancel order: ${error.message}`);
  }
}

const findOrderById = async (orderId) => {
  try {
    const order = await Order.findById(orderId);
    if(!order) {
      throw new Error(`order not found with Id: ${orderId}`);
    }
    return order;
  } catch (error) {
    throw new Error(`failed to find order with Id: ${orderId}: ${error.message}`);
  }
}

const getUserOrders = async (userId) => {
  try {
    const orders = await Order.find({customer: userId});
    return orders;
  } catch (error) {
    throw new Error(`failed to get user orders: ${error.message}`);
  }
}

const getOrdersOfRestaurant = async (restaurantId, orderStatus) => {
  try {
    let orders = await Order.find({restaurant: restaurantId});
    if(orderStatus) {
      orders = orders.filter(order => order.orderStatus === orderStatus);
    }
    return orders;
  } catch (error) {
    throw new Error(`failed to get orders of restaurant with Id: ${restaurantId}: ${error.message}`);
  }
}

const updateOrderStatus = async (orderId, orderStatus) => {
  try {
    const validStatuses = ['PENDING', 'COMPLETED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

    if(!validStatuses.includes(orderStatus)) {
     throw new Error('Please provide a valid order status')
    }
    const order = await Order.findById(orderId)    
    if(!order) {
      throw new Error(`order not found with Id: ${orderId}`);
    }
    order.orderStatus = orderStatus;
    await order.save();
    return order;
  } catch (error) {
    throw new Error(`failed to update order status: ${error.message}`);
  }
}

module.exports = {
  createOrder,
  cancelOrder,
  findOrderById,
  getUserOrders,
  getOrdersOfRestaurant,
  updateOrderStatus,
}