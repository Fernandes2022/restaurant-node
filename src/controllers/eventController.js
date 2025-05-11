const {createEvent, findAllEvents, findRestaurantEvents, deleteEvent, findById} = require('../services/eventService');


const createEventController = async(req, res) => {
  try {
    const {event} = req.body;
    const {restaurantId} = req.params;
    const createdEvents = await createEvent(event, restaurantId);
    res.status(201).json(createdEvents);
  } catch (error) {
    if(error instanceof Error){
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}


const findAllEventsController = async(req, res) => {
  try {
    const events = await findAllEvents();
    res.status(200).json(events);
  } catch (error) {
    if(error instanceof Error){
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
}


const findRestaurantEventsController = async(req, res) => {
  try {
    const {restaurantId} = req.params;
    const events = await findRestaurantEvents(restaurantId);
    res.status(200).json(events);
  } catch (error) {
    if(error instanceof Error){
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
} 


const deleteEventController = async(req, res) => {
  try {
    const {id} = req.params;
    const deletedEvent = await deleteEvent(id);
    res.status(200).json(deletedEvent);
  } catch (error) {
    if(error instanceof Error){
      res.status(400).json({error: error.message});
    } else {
      res.status(500).json({error: 'Internal server error'});
    }
  }
} 


module.exports = {
  createEventController,
  findAllEventsController,
  findRestaurantEventsController,
  deleteEventController,
}
