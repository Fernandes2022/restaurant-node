const IngredientCategory = require('../model/ingredientCategory.model.js')
const IngredientsItem = require('../model/ingredientsItem.model.js')
const Restaurant = require('../model/restaurant.model.js')

const createIngredientCategory = async(name, userId) => {
  try {
    // First find the restaurant
    const restaurant = await Restaurant.findOne({owner: userId});
    if(!restaurant){
      throw new Error('Restaurant not found for this user');
    }

    // Then check if category exists
    let category = await IngredientCategory.findOne({
      restaurant: restaurant._id,
      name: name,
    });

    if(category){
      return category;
    }

    // Create new category
    category = new IngredientCategory({
      name: name,
      restaurant: restaurant._id,
    });

    const createdCategory = await category.save();
    return createdCategory;
  } catch (error) {
    throw new Error(`Error creating ingredient category: ${error.message}`);
  }
}

const findIngredientCategoryById = async(id) => {
  try {
    const category = await IngredientCategory.findById(id);
    if(!category){
      throw new Error(`Ingredient category not found with Id ${id}`);
    }
    return category;
  } catch (error) {
    throw new Error(`Error finding ingredient category: ${error.message}`);
  }
}


const findIngredientCategoryByRestaurantId = async(restaurantId) => {
  try {
    const categories = await IngredientCategory.find({restaurant: restaurantId});
    return categories;
  } catch (error) {
    throw new Error(`Failed to find ingredients categories with Id ${restaurantId}`);
  }
}

const findRestaurantsIngredients = async(restaurantId) => {
  try {
  const items = await IngredientsItem.find({restaurant: restaurantId}).populate('category');
  return items;
  } catch (error) {
    throw new Error(`Failed to find ingredients items with Id ${restaurantId}`);
  }
}


const createIngredientItem = async(ingredientName, ingredientCategoryId, userId) => {
  try {
    const category = await findIngredientCategoryById(ingredientCategoryId);
    const restaurants = await Restaurant.findOne({owner: userId});
    if(!category){
      throw new Error(`Ingredient category not found with Id ${ingredientCategoryId}`);
    }

      let item = await IngredientsItem.findOne({
        name: ingredientName,
        category: category._id,
        restaurant: restaurants._id,
      });

      if(item){
        return item;
      }
      
      item = new IngredientsItem({
        name: ingredientName,
        category: category._id,
        restaurant: restaurants._id,
      });

      const savedItem = await item.save();
      category.ingredients.push(savedItem._id);
      await category.save();
      return savedItem;
      
  } catch (error) {
    throw new Error(`Error creating ingredient item: ${error.message}`);
  }
}


const updateStock = async(id) => {
  try {
    const item = await IngredientsItem.findById(id).populate('category');
    if(!item){
      throw new Error(`Ingredient item not found with Id ${id}`);
    }

    item.inStock = !item.inStock;
    await item.save();
    return item;
  } catch (error) {
    throw new Error(`Error updating stock: ${error.message}`);
  }
}


module.exports = {
  createIngredientCategory,
  findIngredientCategoryById,
  findIngredientCategoryByRestaurantId,
  findRestaurantsIngredients,
  createIngredientItem,
  updateStock,
}
