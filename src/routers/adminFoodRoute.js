const express = require('express');
const router = express.Router();
const {authenticate, authorizeRoles} = require('../middleware/authentication');

const {
 searchFoods,
  getMenuItemByRestaurantId,
  createItem,
  deleteItem,
  updateAvailability
} = require('../controllers/foodController');

router.post('/create', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), createItem);
router.delete('/:id', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), deleteItem);
router.put('/status/:id', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), updateAvailability);


module.exports = router;