const Address = require('../model/address.model');
const Order = require('../model/order.model');
const OrderItem = require('../model/orderItem.model');
const Restaurant = require('../model/restaurant.model');
const User = require('../model/user.model');
const {findCartByUserId, findCartByIdentity, calculateCartTotal, clearCart} = require('./cartService');
const { sendOrderOutForDeliveryEmail } = require('../services/messageService');




const createOrder = async (order, userOrIdentity) => {
  try {
    const address = order.deliveryAddress;
    if (!address) {
      throw new Error('Delivery address is required');
    }

    let savedAddress;

    if (address._id) {    
      savedAddress = await Address.findById(address._id);
      if (!savedAddress) {
        throw new Error('Provided address ID not found');
      }
    } else {
      const shippingAddress = new Address(address);
      savedAddress = await shippingAddress.save();
    }

    // Attach address to user only if authenticated user exists
    let isAuthenticatedUser = Boolean(userOrIdentity && userOrIdentity._id);
    if (isAuthenticatedUser) {
      userOrIdentity.addresses.addToSet(savedAddress._id);
      await userOrIdentity.save();
    }

    const restaurant = await Restaurant.findById(order.restaurantId);
    if (!restaurant) {
      throw new Error(`Restaurant not found with Id: ${order.restaurantId}`);
    }

    let identity;
    if (isAuthenticatedUser) {
      identity = { userId: userOrIdentity._id };
    } else {
      identity = { guestId: order.guestId };
      if (!identity.guestId) {
        throw new Error('Guest identity is missing');
      }
    }

    const cart = await findCartByIdentity(identity);
    if (!cart) {
      throw new Error('Cart not found');
    }

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

    // Calculate items subtotal (exclude delivery fee)
    let itemsSubtotal = 0;
    for (const item of cart.items) {
      itemsSubtotal += Number(item.food.price) * Number(item.quantity);
    }

    // Determine first-order signup discount (authenticated users only)
    let discountAmount = 0;
    if (isAuthenticatedUser) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userOrIdentity._id, signupDiscountUsed: false },
        { $set: { signupDiscountUsed: true } },
        { new: true }
      );
      if (updatedUser) {
        discountAmount = Math.round((0.05 * itemsSubtotal) * 100) / 100; // 5% off, rounded to 2dp
      }
    }

    const totalAmount = (itemsSubtotal - discountAmount) + (cart.deliveryFee || 0);

    const createdOrderPayload = {
      restaurant: restaurant._id,
      totalAmount: totalAmount, 
      orderStatus: 'PENDING',
      deliveryAddress: savedAddress._id,
      deliveryFee: cart.deliveryFee,
      deliveryType: cart.deliveryType,
      createdAt: new Date(),
      items: orderItems,
      discountAmount: discountAmount,
    };
    if (isAuthenticatedUser) {
      createdOrderPayload.customer = userOrIdentity._id;
    } else {
      createdOrderPayload.guestId = identity.guestId;
      if (order.guestDetails) {
        createdOrderPayload.guestDetails = {
          name: order.guestDetails.name,
          email: order.guestDetails.email,
          phone: order.guestDetails.phone,
        };
      }
    }

    const createdOrder = new Order(createdOrderPayload);
    

    const savedOrder = await createdOrder.save();

    restaurant.orders.push(savedOrder._id);
    await restaurant.save();

    
    await clearCart(identity);

    return savedOrder;
  } catch (error) {
    throw new Error(`Failed to create order: ${error.message}`);
  }
};







const cancelOrder = async (orderId, ownerUserId) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: ownerUserId });
    if (!restaurant) {
      throw new Error('Restaurant not found for this user');
    }

    const order = await Order.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.restaurant.toString() !== restaurant._id.toString()) {
      throw new Error('Order does not belong to your restaurant');
    }

    // Remove order reference from restaurant
    await Restaurant.updateOne({ _id: restaurant._id }, { $pull: { orders: order._id } });

    // Delete associated order items
    if (order.items && order.items.length > 0) {
      await OrderItem.deleteMany({ _id: { $in: order.items } });
    }

    // Finally delete the order
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
    const restaurant = await Restaurant.findOne({ owner: userId });

    if (!restaurant) {
      throw new Error('Restaurant not found for this user');
    }

    let query = Order.find({ restaurant: restaurant._id })
      .populate('customer', 'fullName email') 
      .populate('deliveryAddress')            
      .populate({
        path: 'items',
        populate: {
          path: 'food',
          select: 'name images price',         
        }
      });

    if (orderStatus) {
      query = query.where('orderStatus').equals(orderStatus);
    }

    const orders = await query.sort({ createdAt: -1 });

    return orders;
  } catch (error) {
    throw new Error(`Failed to get orders of restaurant: ${error.message}`);
  }
};


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

    // Send email if transitioned to OUT_FOR_DELIVERY
    if (orderStatus === 'OUT_FOR_DELIVERY') {
      try {
        let recipientEmail = null;
        let itemsSummary = [];
        let itemsSubtotal = 0;
        // populate items->food to compute summary if not already populated
        await order.populate({ path: 'items', populate: { path: 'food', select: 'name price' } });
        if (order.items && order.items.length) {
          for (const it of order.items) {
            const price = Number(it.food?.price || 0);
            const qty = Number(it.quantity || 0);
            itemsSubtotal += price * qty;
            itemsSummary.push({ name: it.food?.name || 'Item', quantity: qty, price, lineTotal: price * qty });
          }
        }
        if (order.customer) {
          const user = await User.findById(order.customer);
          recipientEmail = user?.email || null;
        } else if (order.guestDetails?.email) {
          recipientEmail = order.guestDetails.email;
        }
        if (recipientEmail) {
          await sendOrderOutForDeliveryEmail({
            to: recipientEmail,
            orderId: order._id.toString(),
            restaurantName: (await Restaurant.findById(order.restaurant))?.name,
            items: itemsSummary,
            totals: {
              itemsSubtotal,
              discountAmount: order.discountAmount || 0,
              deliveryFee: order.deliveryFee || 0,
              totalAmount: order.totalAmount || 0,
            }
          });
        }
      } catch (_) {
        // swallow email errors to not block order status updates
      }
    }
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