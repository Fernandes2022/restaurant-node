const {
  createFood,
  deleteFood,
  getRestaurantsFood,
  searchFood,
  updateAvailabilityStatus,
  findFoodById
} = require('../services/foodService.js');

const {
 createRestaurant,
 getAllRestaurants,
 deleteRestaurant,
 findRestaurantById,
 addToFavourite,
 updateRestaurantStatus,
 searchRestaurant,
 getRestaurantByUserId,
} = require('../services/restaurantService');


// Customer
const searchFoods = async(req, res) => {
 try {
  const {name} = req.query;
  const menuItem = await searchFood(name);
  res.status(200).json(menuItem);
 } catch (error) {
  res.status(500).json({error: "Internal server error"})
 }
}

const getMenuItemByRestaurantId = async(req, res) => {
 try {
  const {restaurantId} = req.params;
  const {vegetarian, seasonal, nonveg, food_category} = req.query;
  const menuItems = await getRestaurantsFood(
   restaurantId,
   vegetarian,
   nonveg,
   seasonal,
   food_category
  )

  res.status(200).json(menuItems);

 } catch (error) {
   if (error instanceof Error) {
    res.status(400).json({error: error.message});
   } else {
    res.status(500).json({error: "Internal server error"});
   }
 }
}

// Admin

const createItem = async(req, res) => {
  try {
    const user = req.user;
    
    // Get restaurant by user ID instead of using restaurantId from request
    const restaurant = await getRestaurantByUserId(user._id);
    if (!restaurant) {
      throw new Error('No restaurant found for this admin');
    }
    
    const menuItem = await createFood(req.body, restaurant);
    res.status(200).json(menuItem);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"})
    }
  }
}

const deleteItem = async (req, res) => {
 try {
  const {id} = req.params;
  await deleteFood(id);
  res.status(200).json({message: "Food item deleted successfully"});
 } catch (error) {
  if(error instanceof Error) {
   res.status(400).json({error: error.message}); 
  } else {
   res.status(500).json({error: "Internal server error"});
  }
 }
}

const updateAvailability = async (req, res) => {
  try {
    const {id} = req.params;
    const menuItem = await updateAvailabilityStatus(id);
    res.status(200).json(menuItem);
  } catch (error) {
    if(error instanceof Error) {
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: "Internal server error"});
    }
  }
}


module.exports = {
  searchFoods,
  getMenuItemByRestaurantId,
  createItem,
  deleteItem,
  updateAvailability
}
