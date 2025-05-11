const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication')

const { createOrderController, getUserOrdersController } = require('../controllers/orderController');

router.post('/', authenticate, createOrderController);
router.get('/user', authenticate, getUserOrdersController);

module.exports = router;
