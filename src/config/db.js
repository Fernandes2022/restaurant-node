const mongoose = require('mongoose')
require('dotenv').config();

async function connectDB() {
   return mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
   })
}

module.exports = connectDB