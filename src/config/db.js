const mongoose = require('mongoose')
require('dotenv').config();

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            family: 4,
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        };

        cached.promise = mongoose.connect(process.env.MONGO_URI, opts)
            .then((mongoose) => {
                console.log('MongoDB Connected Successfully');
                return mongoose;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        console.error('Error connecting to MongoDB:', e.message);
        throw e;
    }

    return cached.conn;
}

module.exports = connectDB;