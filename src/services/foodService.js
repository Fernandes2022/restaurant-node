const Food = require('../model/food.model');


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
   available: req.availabe
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
    throw new Error(`Failed to retrieve restaurant's food: ${error.message}`);
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