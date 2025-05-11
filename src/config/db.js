const mongoose = require('mongoose')

const mongodbUrl="mongodb+srv://jelilirokeebadeyeye:qVxIqGLyAAcFc9JX@cluster0.gejwg.mongodb.net/Restaurant-Node?retryWrites=true&w=majority&appName=Cluster0"

async function connectDB() {
   return mongoose.connect(mongodbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
   })
}

module.exports = connectDB