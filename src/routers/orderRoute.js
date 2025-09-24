const express = require('express');
const router = express.Router();
const {authenticate, identifyCustomer} = require('../middleware/authentication')

const { createOrderController, getUserOrdersController } = require('../controllers/orderController');

router.post('/', identifyCustomer, createOrderController);
router.get('/user', authenticate, getUserOrdersController);

module.exports = router;
