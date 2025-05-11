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

router.post('/create', authenticate, createItem);
router.delete('/:id', authenticate, deleteItem);
router.put('/status/:id', authenticate, updateAvailability);


module.exports = router;