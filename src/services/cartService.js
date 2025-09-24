const Cart = require('../model/cart.model');
const CartItem = require('../model/cartItem.model');
const Food = require('../model/food.model');

const createCartForIdentity = async (identity) => {
  const cartPayload = {};
  if (identity && identity.userId) {
    cartPayload.customer = identity.userId;
  }
  if (identity && identity.guestId) {
    cartPayload.guestId = identity.guestId;
  }
  const cart = new Cart(cartPayload);
  const createdCart = await cart.save();
  return createdCart;
};

// Backward-compatible wrapper
const createCart = async (user) => {
  return createCartForIdentity({ userId: user });
};


const findCartByIdentity = async (identity) => {
  const query = {};
  if (identity && identity.userId) {
    query.customer = identity.userId;
  } else if (identity && identity.guestId) {
    query.guestId = identity.guestId;
  } else {
    throw new Error('No identity provided');
  }

  let cart = await Cart.findOne(query).populate([
    {
      path: 'items',
      populate: {
        path: 'food',
        populate: { path: 'restaurant', select: '_id' },
      },
    },
  ]);

  if (!cart) {
    cart = await createCartForIdentity(identity);
  }

  let totalPrice = 0;
  let totalItems = 0;

  for (let item of cart.items) {
    totalPrice += Number(item.totalPrice) || 0;
    totalItems += Number(item.quantity) || 0;
  }

  cart.totalPrice = totalPrice;
  cart.totalItems = totalItems;
  cart.total = totalPrice + (cart.deliveryFee || 0);

  await cart.save();
  return cart;
};

// Backward-compatible wrapper
const findCartByUserId = async (userId) => {
  return findCartByIdentity({ userId });
};



const addItemToCart = async (req, identity) => {
  try {
    const cart = await findCartByIdentity(identity);

    const food = await Food.findById(req.menuItemId);
    if (!food) {
      throw new Error(`Food item not found with ID: ${req.menuItemId}`);
    }

    const existingItem = await CartItem.findOne({
      cart: cart._id,
      food: food._id,
    });

    if (existingItem) {
      return existingItem;
    }

    const quantity = req.quantity || 1;

    const newCartItem = await CartItem.create({
      cart: cart._id,
      food: food._id,
      quantity,
      totalPrice: food.price * quantity,
    });

    await Cart.findByIdAndUpdate(
      cart._id,
      { $addToSet: { items: newCartItem._id } },
      { new: true }
    );

    return newCartItem;
  } catch (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
};



const updateCartQuantity = async (cartItemId, quantity) => {
  const cartItem = await CartItem.findById(cartItemId).populate([
    { path: 'food', populate: { path: 'restaurant', select: '_id' } }
  ]);

  if (!cartItem) {
    throw new Error(`Cart item not found: ${cartItemId}`);
  }

  const foodPrice = Number(cartItem.food?.price) || 0;
  const discountedPricePerUnit = Number(cartItem.food?.discountedPrice) || 0;
  const safeQuantity = Number(quantity) || 0;

  cartItem.quantity = safeQuantity;
  cartItem.totalPrice = foodPrice * safeQuantity;
  cartItem.discountedPrice = discountedPricePerUnit * safeQuantity;

  await cartItem.save();
  return cartItem;
};


const removeItemFromCart = async (cartItemId, identity) => {
  const cart = await findCartByIdentity(identity);

  cart.items = cart.items.filter((item) => !item.equals(cartItemId));
  await cart.save();

  await CartItem.deleteOne({ _id: cartItemId });

  return cart;
};


const clearCart = async (identity) => {
  const cart = await findCartByIdentity(identity);

  await CartItem.deleteMany({ cart: cart._id });

  cart.items = [];
  await cart.save();

  return cart;
};


const calculateCartTotal = async (cart) => {
 try {
  let total = 0;
  
  for(let cartItem of cart.items) {
   total += cartItem.food.price * cartItem.quantity;
  }

  total += cart.deliveryFee || 0;

  return total;
 } catch (error) {
  throw new Error(error.message);
 }
  
};

const setDeliveryType = async (identity, type) => {
  const cart = await findCartByIdentity(identity);

  if (!['IN_CAMPUS', 'OFF_CAMPUS'].includes(type)) {
    throw new Error('Invalid delivery type');
  }

  cart.deliveryType = type;
  cart.deliveryFee = type === 'IN_CAMPUS' ? 300 : 500;

  await cart.save();
  return cart;
};


module.exports = {
  createCart,
  createCartForIdentity,
  findCartByUserId,
  findCartByIdentity,
  addItemToCart,
  updateCartQuantity,
  removeItemFromCart,
  clearCart,
  calculateCartTotal,
  setDeliveryType
}
