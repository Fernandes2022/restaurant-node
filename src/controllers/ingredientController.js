const {
  createIngredientCategory,
  findIngredientCategoryById,
  findIngredientCategoryByRestaurantId,
  findRestaurantsIngredients,
  createIngredientItem,
  updateStock,
} = require('../services/ingredientService');



const createIngredientCategoryController = async(req, res) => {
  try {
    const { name, restaurantId } = req.body;
    const items = await createIngredientCategory(name, restaurantId);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}


const createIngredientItemController = async(req, res) => {
  try {
    const { name, ingredientCategoryId, restaurantId } = req.body;
    const item = await createIngredientItem(name, ingredientCategoryId, restaurantId);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
}


const updateStockController = async(req, res) => {
  try {
    const { id } = req.params;
    const item = await updateStock(id);
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
}

const findRestaurantIngredientsController = async(req, res) => {
  try {
    const { id } = req.params;
    const items = await findRestaurantsIngredients(id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
} 

const findIngredientCategoryByRestaurantIdController = async(req, res) => {
  try {
    const { id } = req.params;
    const items = await findIngredientCategoryByRestaurantId(id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'internal server error' });
  }
} 


module.exports = {
  createIngredientCategoryController,
  createIngredientItemController,
  updateStockController,
  findRestaurantIngredientsController,
  findIngredientCategoryByRestaurantIdController,
}








