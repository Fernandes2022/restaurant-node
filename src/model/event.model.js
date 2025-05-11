const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
 image: String,
 startedAt: String,
 endsAt: String,
 name: String,
 restaurant: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Restaurant',
 },
 location: String,
})

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
