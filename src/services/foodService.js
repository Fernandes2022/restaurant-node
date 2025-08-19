const Food = require('../model/food.model');
const Cart = require('../model/cart.model');
const CartItem = require('../model/cartItem.model');


const createFood = async (req, restaurant) => {

 try {
  const food = new Food({
   foodCategory: req.category,
   creationDate: new Date(),
   description: req.description,
   images: req.images,
   name: req.name,
   price: req.price,
   isSeasonal: req.seasonal,
   isVegetarian: req.vegetarian,
   restaurant: restaurant._id,
   ingredients: req.ingredients,
   available: req.available
  });
  await food.save();
  restaurant.foods.push(food._id);
  await restaurant.save();
  return food;
 } catch (error) {
   throw new Error(`Failed to create food: ${error.message}`);
 }
}

const deleteFood = async (foodId) => {
 try {
  const food = await Food.findById(foodId);
  if(!food){
   throw new Error(`Food not found with ID ${foodId}`)
  }

  // Remove any cart items that reference this food from all carts
  const cartItems = await CartItem.find({ food: foodId }).select('_id');
  if (cartItems && cartItems.length > 0) {
   const cartItemIds = cartItems.map((ci) => ci._id);

   // Pull the cart item ids from any cart that contains them
   await Cart.updateMany(
    { items: { $in: cartItemIds } },
    { $pull: { items: { $in: cartItemIds } } }
   );

   // Delete the orphaned cart item documents
   await CartItem.deleteMany({ _id: { $in: cartItemIds } });
  }

  await Food.findByIdAndDelete(foodId);
 } catch (error) {
    throw new Error(error.message);
    
 }
} 

const getRestaurantsFood = async (restaurantId, vegetarian, nonveg, seasonal, foodCategory) => {
  try {
   let query = {restaurant: restaurantId};
   console.log(nonveg)
   if(vegetarian === 'true'){
    query.isVegetarian = true;
   }

   if(nonveg === 'true') query.vegetarian = false;
   if(seasonal === 'true') query.isSeasonal = true;
   if(foodCategory) query.foodCategory = foodCategory;

   const foods = await Food.find(query).populate([
    {path: 'ingredients', populate: {path: 'category', select: 'name'}},
    {path: 'restaurant', select: 'name _id'},
   ]);
   return foods;
  } catch (error) {
    throw new Error(`Failed to retrieve restaurant's menu: ${error.message}`);
  }
}

const searchFood = async(keyword) => {
  try {
    let query = {};
    if(keyword) {
      query.$or = [
        {name: {$regex: keyword, $options: "i"}},
        {"foodCategory.name": {$regex: keyword, $options: "i"}},
      ]
    };

    const foods = await Food.find(query);
    return foods;
  } catch (error) {
    throw new Error(`Failed to search food: ${error.message}`);
  }
}

const updateAvailabilityStatus = async(foodId) => {
  try {
    const food = await Food.findById(foodId).populate([
      {path: "ingredients", populate: {path: "category", select: "name"}},
      {path: "restaurant", select: "name _id"}
    ]);

    if(!food) {
      throw new Error(`FOod not found with id ${foodId}`);
    }
    food.available = !food.available;
    await food.save();
    return food; 
  } catch (error) {
    throw new Error(`Failed to update availability status for food with id ${foodId}: ${error.message}`)
  }
}

const findFoodById = async(foodId) => {
  try {
    const food = await Food.findById(foodId);
    if(!food){
      throw new Error(`Food not found with id ${foodId}`);
    }
    return food;
  } catch (error) {
    throw new Error(`Failed to find food with id ${foodId}: ${error.message}`)
  };
}

module.exports = {
  createFood,
  deleteFood,
  getRestaurantsFood,
  searchFood,
  updateAvailabilityStatus,
  findFoodById
}