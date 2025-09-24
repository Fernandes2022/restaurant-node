const express = require('express');
const router = express.Router();
const {authenticate, authorizeRoles} = require('../middleware/authentication');


const {
 createEventController,
  findAllEventsController,
  findRestaurantEventsController,
  deleteEventController,
} = require('../controllers/eventController');


router.post('/restaurant/:restaurantId', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), createEventController);
router.get('/restaurant/:restaurantId', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), findRestaurantEventsController);

router.delete('/:id', authenticate, authorizeRoles('ROLE_RESTAURANT_OWNER'), deleteEventController);

module.exports = router;