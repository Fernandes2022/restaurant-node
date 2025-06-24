const Category = require('../model/category.model');
const Restaurant = require('../model/restaurant.model');


const createCategory = async (name, userId) => {
  try {
    const restaurant = await Restaurant.findOne({owner: userId});
    if(!restaurant) {
      throw new Error(`Restaurant not found for user with Id: ${userId}`);
    }

    const category = new Category({
      name,
      restaurant: restaurant._id,
    });

    await category.save();
    return category;
  } catch (error) {
    throw new Error(`Failed to create category: ${error.message}`);
  }
}


const findCategoryByRestaurantId = async (userId) => {
  try {
    const restaurant = await Restaurant.findOne({owner: userId});
    const categories = await Category.find({restaurant: restaurant._id});
    return categories;
  } catch (error) {
    throw new Error(`Failed to find categories for restaurant Id: ${error.message}`);
  }
}
const findCategoryByRestaurantIds = async (id) => {
  try {
    
    const categories = await Category.find({restaurant: id});
    return categories;
  } catch (error) {
    throw new Error(`Failed to find categories for restaurant Id: ${error.message}`);
  }
}

const findCategoryById = async (categoryId) => {
  try {
    const category = await Category.findById(categoryId);
    if(!category) {
      throw new Error(`Category not found with Id: ${categoryId}`);
    }
    return category;
  } catch (error) {
    throw new Error(`Failed to find category with Id: ${categoryId}: ${error.message}`);
  }
}


module.exports = {
  createCategory,
  findCategoryByRestaurantId,
  findCategoryByRestaurantIds,
  findCategoryById,
}
