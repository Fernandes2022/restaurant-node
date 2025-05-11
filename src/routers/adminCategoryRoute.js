const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {createCategoryController, findCategoryByRestaurantIdController} = require('../controller/categoryController');


router.post('/', authenticate, createCategoryController);
router.get('/restaurant/:id', authenticate, findCategoryByRestaurantIdController);
