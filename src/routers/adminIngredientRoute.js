const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');

const {
 createIngredientCategoryController,
  createIngredientItemController,
  updateStockController,
  findRestaurantIngredientsController,
  findIngredientCategoryByRestaurantIdController
} = require('../controllers/ingredientController');


router.post('/category', authenticate, createIngredientCategoryController);
router.post('/', authenticate, createIngredientItemController);
router.put('/:id/stock', authenticate , updateStockController);
router.get('/restaurant/:id', authenticate, findRestaurantIngredientsController);
router.get('/restaurant/:id/category', authenticate, findIngredientCategoryByRestaurantIdController);


module.exports = router;