const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');

const {findCategoryByRestaurantIdControllers} = require('../controllers/categoryController');

router.get('/restaurant/:id', findCategoryByRestaurantIdControllers);



module.exports = router;