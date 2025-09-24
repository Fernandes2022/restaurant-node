const express = require('express');
const router = express.Router();
const {authenticate, authorizeRoles} = require('../middleware/authentication');


const {createCategoryController, findCategoryByRestaurantIdController} = require('../controllers/categoryController');


router.post('/', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), createCategoryController);
router.get('/restaurant', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), findCategoryByRestaurantIdController);

module.exports = router;
