const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {createCategoryController, findCategoryByRestaurantIdController} = require('../controllers/categoryController');


router.post('/', authenticate, createCategoryController);
router.get('/restaurant', authenticate, findCategoryByRestaurantIdController);

module.exports = router;
