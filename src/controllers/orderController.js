const {
 createOrder,
 cancelOrder,
 findOrderById,
 getUserOrders,
 getOrdersOfRestaurant,
 updateOrderStatus,
} = require('../services/orderService');

const {findUserById,} = require('../services/userServices');


const createOrderController = async (req, res) => {
  try {
  const order = req.body;
  const user = req.user;

  if(!order) {
   throw new Error('Please provide a valid request body');
  }

  const paymentResponse = await createOrder(order, user);
  res.status(201).json(paymentResponse);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unexpected error occurred'});
    }
  }
}

const getUserOrdersController = async (req, res) => {
  try {
   const user = req.user;

   const userOrders = await getUserOrders(user._id);
   res.status(200).json(userOrders);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'An unexpected error occurred'});
    }
  }
}


//Admin

const cancelOrderController = async (req, res) => {
  try {
   const {orderId} = req.params;
   await cancelOrder(orderId);
   res.status(200).json({message: 'Order cancelled successfully'});
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}

const getOrdersOfRestaurantController = async (req, res) => {
  try {
      const user = req.user;
      const {order_status} = req.query;

      const orders = await getOrdersOfRestaurant(user._id, order_status);
      res.status(200).json(orders);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}

const updateOrderStatusController = async (req, res) => {
  try {
    const {orderId, orderStatus} = req.params;
    const order = await updateOrderStatus(orderId, orderStatus);
    res.status(200).json(order);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}


module.exports = {
  cancelOrderController,
  getOrdersOfRestaurantController,
  updateOrderStatusController,
  createOrderController,
  getUserOrdersController
}
