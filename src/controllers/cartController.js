const {createCart, findCartByUserId, findCartByIdentity, addItemToCart, updateCartQuantity, removeItemFromCart, clearCart, calculateCartTotal, setDeliveryType} = require('../services/cartService');

const {findUserById, findUserProfileByJwt} = require('../services/userServices');

const addToCart = async (req, res) => {
  try {
   const identity = req.user?._id ? { userId: req.user._id } : { guestId: req.guestId };
   const cart = await addItemToCart(req.body, identity);
   res.status(200).json(cart);
  } catch (error) {
   if(error instanceof Error) {
    res.status(400).json({error: error.message});
   } else {
    res.status(500).json({error: "Internal server error"});
   }
  }
}

const updateCartItemQuantity = async (req, res) => {
  try {
    const {cartItemId, quantity} = req.body;
    const cart = await updateCartQuantity(cartItemId, quantity);
    res.status(200).json(cart);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}

const removeFromCart = async (req, res) => {
  try {
    const {id} = req.params;
    const identity = req.user?._id ? { userId: req.user._id } : { guestId: req.guestId };
    const cart = await removeItemFromCart(id, identity);
    res.status(200).json(cart);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}

const findUserCart = async (req, res) => {
  try {
    const identity = req.user?._id ? { userId: req.user._id.toString() } : { guestId: req.guestId };
    const cart = await findCartByIdentity(identity);
    res.status(200).json(cart);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}

const calculateCartTotalController = async (req, res) => {
  try {
    const identity = req.user?._id ? { userId: req.user._id } : { guestId: req.guestId };
    const cart = await findCartByIdentity(identity);

    const total = await calculateCartTotal(cart);

   
    res.status(200).json({ total });
  } catch (error) {
    res.status(500).json({ message: `Error calculating cart total: ${error.message}` });
  }
};

const clearingCart = async (req, res) => {
  try {
    const identity = req.user?._id ? { userId: req.user._id } : { guestId: req.guestId };
    const cart = await clearCart(identity);
    res.status(200).json(cart);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}

const deliveryTypeController = async (req, res) => {

  try {
    const {type} = req.body;
    const identity = req.user?._id ? { userId: req.user._id.toString() } : { guestId: req.guestId };
    const cart = await setDeliveryType(identity, type);
    res.status(200).json(cart);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}

  module.exports = {
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  findUserCart,
  clearingCart,
  calculateCartTotalController,
  deliveryTypeController
}



