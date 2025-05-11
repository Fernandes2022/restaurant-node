const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');


const {
 createEventController,
  findAllEventsController,
  findRestaurantEventsController,
  deleteEventController,
} = require('../controllers/eventController');


router.post('/restaurant/:restaurantId', createEventController);
router.get('/restaurant/:restaurantId', findRestaurantEventsController);

router.delete('/:id', deleteEventController);

module.exports = router;