const express = require('express');
const router = express.Router();
const {authenticate, authorizeRoles} = require('../middleware/authentication');

const {
 createIngredientCategoryController,
  createIngredientItemController,
  updateStockController,
  findRestaurantIngredientsController,
  findIngredientCategoryByRestaurantIdController
} = require('../controllers/ingredientController');


router.post('/category', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), createIngredientCategoryController);
router.post('/', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), createIngredientItemController);
router.put('/:id/stock', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), updateStockController);
router.get('/restaurant/:id', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), findRestaurantIngredientsController);
router.get('/restaurant/:id/category', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), findIngredientCategoryByRestaurantIdController);


module.exports = router;