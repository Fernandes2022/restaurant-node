const Address = require('../model/address.model');
const Order = require('../model/order.model');
const OrderItem = require('../model/orderItem.model');
const Restaurant = require('../model/restaurant.model');
const {findCartByUserId, calculateCartTotal, clearCart} = require('./cartService');




const createOrder = async (order, user) => {
  try {
    const address = order.deliveryAddress;
    let savedAddress;

    if (!address) {
      throw new Error('Delivery address is required');
    }

    if (address._id) {
      // Use existing address if ID is provided
      savedAddress = await Address.findById(address._id);
      if (!savedAddress) {
        throw new Error('Provided address ID not found');
      }
    } else {
      // Check if an identical address already exists for this user
      savedAddress = await Address.findOne({
        fullName: address.fullName,
        streetAddress: address.streetAddress,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      });

      if (!savedAddress) {
        // Create new only if not found
        const shippingAddress = new Address(address);
        savedAddress = await shippingAddress.save();
      }
    }

    // Add address to user's saved addresses if not already present
    const addressAlreadySaved = user.addresses
      .map(addrId => addrId.toString())
      .includes(savedAddress._id.toString());

    if (!addressAlreadySaved) {
      user.addresses.push(savedAddress._id);
      await user.save();
    }

    // Find restaurant
    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant) {
      throw new Error(`Restaurant not found with Id: ${order.restaurantId}`);
    }

    // Get user's cart
    const cart = await findCartByUserId(user._id);
    if (!cart) {
      throw new Error('Cart not found');
    }

    // Create order items
    const orderItems = [];
    for (const cartItem of cart.items) {
      const orderItem = new OrderItem({
        food: cartItem.food,
        quantity: cartItem.quantity,
        totalPrice: cartItem.food.price * cartItem.quantity,
        ingredients: cartItem.ingredients,
      });
      const savedOrderItem = await orderItem.save();
      orderItems.push(savedOrderItem._id);
    }

    // Calculate total price
    const totalPrice = await calculateCartTotal(cart);

    // Create the order
    const createdOrder = new Order({
      customer: user._id,
      restaurant: restaurant._id,
      totalAmount: totalPrice + cart.deliveryFee, // include delivery fee
      orderStatus: 'PENDING',
      deliveryAddress: savedAddress._id,
      deliveryType: cart.deliveryType,
      deliveryFee: cart.deliveryFee,
      createdAt: new Date(),
      items: orderItems,
    });

    const savedOrder = await createdOrder.save();

    // Add order to restaurant
    restaurant.orders.push(savedOrder._id);
    await restaurant.save();

    // Clear user's cart
    await clearCart(user);

    return savedOrder;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};






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

const getOrdersOfRestaurant = async (userId, orderStatus) => {
  try {
    const restaurant = await Restaurant.findOne({owner: userId});
    let orders = await Order.find({restaurant: restaurant._id});
    if(orderStatus) {
      orders = orders.filter(order => order.orderStatus === orderStatus);
    }
    return orders;
  } catch (error) {
    throw new Error(`failed to get orders of restaurant : ${error.message}`);
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