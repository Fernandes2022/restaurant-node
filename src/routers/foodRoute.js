const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');

const {
 searchFoods,
  getMenuItemByRestaurantId,
  createItem,
  deleteItem,
  updateAvailability
} = require('../controllers/foodController');


router.get('/search', searchFoods);
router.get('/restaurant/:restaurantId', getMenuItemByRestaurantId);


module.exports = router;