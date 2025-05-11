const Event = require('../model/event.model');
const Restaurant = require('../model/restaurant.model');


const createEvent = async(event, restaurantId) => {
  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if(!restaurant){
      throw new Error(`Restaurant not found with id ${restaurantId}`);
    }

    const createdEvent = new Event({
      restaurant: restaurantId,
      image: event.image,
      startedAt: event.startedAt,
      endsAt: event.endsAt,
      name: event.name,
      location: event.location,
    })

    await createdEvent.save();
    return createdEvent;
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
}


const findAllEvents = async() => {
  try {
    const events = await Event.find();
    return events;
  } catch (error) {
    throw new Error(`Failed to find events: ${error.message}`);
  }
}


const findRestaurantEvents = async(restaurantId) => {
  try {
    const events = await Event.find({ restaurant: restaurantId });
    return events;
  } catch (error) {
    throw new Error(`Failed to find events for restaurant ${restaurantId}: ${error.message}`);
  }
}


const deleteEvent = async(eventId) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return deletedEvent;
  } catch (error) {
    throw new Error(`Failed to delete event ${eventId}: ${error.message}`);
  }
}

const findById = async(eventId) => {
  try {
    const event = await Event.findById(eventId);

    if(!event){
      throw new Error(`Event not found with id ${eventId}`);
    }

    return event;
  } catch (error) {
    throw new Error(`Failed to find event ${eventId}: ${error.message}`);
  }
}


module.exports = {
  createEvent,
  findAllEvents,
  findRestaurantEvents,
  deleteEvent,
  findById,
}
