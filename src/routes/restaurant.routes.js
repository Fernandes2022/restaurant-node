const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const {authenticate} = require("../middleware/authentication")
const { validateRestaurant, validateRestaurantUpdate } = require('../middleware/restaurantValidation');
const { authorizeRoles } = require('../middleware/authentication');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/search', restaurantController.searchRestaurants);
router.get('/myrestaurant', authenticate, restaurantController.getRestaurantByUserId);
router.get('/:id', restaurantController.getRestaurantById);

// Protected routes (require authentication)
router.use(authenticate);

// Customer routes
router.post('/favourite/:id', authenticate, restaurantController.addToFavourite);
router.post('/rate/:id', authenticate, restaurantController.updateRestaurantRating);




router.post('/',  
    authenticate, 
    restaurantController.createRestaurant
);

router.put('/:id', 
    authenticate, 
    validateRestaurantUpdate, 
    restaurantController.updateRestaurant
);

router.delete('/:id',  
    authenticate, 
    restaurantController.deleteRestaurant
);

router.patch('/:id/status', 
    authenticate,
    restaurantController.updateRestaurantStatus
);

// Restaurant order management routes
router.get('/:id/orders',
    authenticate,
    restaurantController.getRestaurantOrders
);

router.put('/:id/orders/:orderId',
    authenticate,
    restaurantController.updateOrderStatus
);




module.exports = router; 