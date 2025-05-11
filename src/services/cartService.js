const Cart = require('../model/cart.model');
const CartItem = require('../model/cartItem.model');
const Food = require('../model/food.model');

const createCart = async (user) => {
  const cart = new Cart({customer: user});
  const createdCart = await cart.save();
  return createdCart;
};


const findCartByUserId = async (userId) => {
  let cart;

  cart = await Cart.findOne({ customer: userId }).populate([
    {
      path: 'items',
      populate: {
        path: 'food',
        populate: { path: 'restaurant', select: '_id' },
      },
    },
  ]);

  if (!cart) {
    throw new Error(`Cart not found: ${userId}`);
  }

  console.log(cart.items);

  let totalPrice = 0;
  let totalDiscountedPrice = 0;
  let totalItems = 0;

  for (let item of cart.items) {
    totalPrice += Number(item.totalPrice) || 0;
    totalDiscountedPrice += Number(item.discountedPrice) || 0;
    totalItems += Number(item.quantity) || 0;
  }

  cart.totalPrice = totalPrice;
  cart.totalDiscountedPrice = totalDiscountedPrice;
  cart.totalItems = totalItems;

  const discount = totalPrice - totalDiscountedPrice;
  cart.discount = isNaN(discount) ? 0 : discount;

  await cart.save();
  return cart;
};



const addItemToCart = async (req, userId) => {
  try {
    // First check if cart exists, if not create one
    let cart = await Cart.findOne({customer: userId});
    if (!cart) {
      cart = await createCart(userId);
    }

    // Check if food item exists
    const food = await Food.findById(req.menuItemId);
    if (!food) {
      throw new Error(`Food item not found with ID: ${req.menuItemId}`);
    }

    // Check if item already exists in cart
    const isPresent = await CartItem.findOne({
      cart: cart._id,
      food: food._id,
    });

    if (!isPresent) {
      const cartItem = new CartItem({
        food: food._id,
        cart: cart._id,
        quantity: 1,
        totalPrice: food.price,
      });

      const createdCartItem = await cartItem.save();
      cart.items.push(createdCartItem._id);
      await cart.save();
      return createdCartItem;
    }
 
    return isPresent;
  } catch (error) {
    throw new Error(`Failed to add item to cart: ${error.message}`);
  }
}


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


const removeItemFromCart = async (cartItemId, user) => {
   const cart = await Cart.findOne({customer: user._id});
   if(!cart) {
    throw new Error(`Cart not found: ${user._id}`);
   }

   cart.items = cart.items.filter((item) => !item.equals(cartItemId));
   await cart.save();
   return cart;
}

const clearCart = async (user) => {
  const cart = await Cart.findOne({customer: user._id});

  if(!cart) {
    throw new Error(`Cart not found: ${user._id}`);
  }

  cart.items = [];
  await cart.save();
  return cart;
}

const calculateCartTotal = async (cart) => {
 try {
  let total = 0;
  
  for(let cartItem of cart.items) {
   total += cartItem.food.price * cartItem.quantity;
  }

  return total;
 } catch (error) {
  throw new Error(error.message);
 }
  
};


module.exports = {
  createCart,
  findCartByUserId,
  addItemToCart,
  updateCartQuantity,
  removeItemFromCart,
  clearCart,
  calculateCartTotal,

}
