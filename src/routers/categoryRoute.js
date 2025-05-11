const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');

const {findCategoryByRestaurantIdController} = require('../controllers/categoryController');

router.get('/restaurant/:id', authenticate, findCategoryByRestaurantIdController);



module.exports = router;