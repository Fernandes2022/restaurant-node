const express = require('express');
const router = express.Router();
const {authenticate} = require('../middleware/authentication');

const {
 createEventController,
  findAllEventsController,
  findRestaurantEventsController,
  deleteEventController,
} = require('../controllers/eventController');




router.get('/', findAllEventsController);

module.exports = router;