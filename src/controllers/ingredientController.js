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
    const user = req.user;
    const { name } = req.body;
    const items = await createIngredientCategory(name, user._id);
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
}


const createIngredientItemController = async(req, res) => {
  try {
    const { name, ingredientCategoryId } = req.body;
    const user = req.user;
    const item = await createIngredientItem(name, ingredientCategoryId, user._id);
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








