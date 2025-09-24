const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const {authenticate, authorizeRoles} = require("../middleware/authentication")
const { validateRestaurant, validateRestaurantUpdate } = require('../middleware/restaurantValidation');
const { authorizeRoles } = require('../middleware/authentication');

// Public routes
router.get('/', restaurantController.getAllRestaurants);
router.get('/search', restaurantController.searchRestaurants);
router.get('/myrestaurant', authenticate, restaurantController.getRestaurantByUserId);
router.get('/:id', restaurantController.getRestaurantById);

// Customer routes (require logged-in user to persist on profile)
router.post('/favourite/:id', authenticate, restaurantController.addToFavourite);
router.post('/rate/:id', authenticate, restaurantController.updateRestaurantRating);




router.post('/',  
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'), 
    restaurantController.createRestaurant
);

router.put('/:id', 
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'), 
    validateRestaurantUpdate, 
    restaurantController.updateRestaurant
);

router.delete('/:id',  
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'), 
    restaurantController.deleteRestaurant
);

router.patch('/:id/status', 
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'),
    restaurantController.updateRestaurantStatus
);

// Restaurant order management routes
router.get('/:id/orders',
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'),
    restaurantController.getRestaurantOrders
);

router.put('/:id/orders/:orderId',
    authenticate,
    authorizeRoles('ROLE_RESTAURANT_OWNER'),
    restaurantController.updateOrderStatus
);




module.exports = router; 