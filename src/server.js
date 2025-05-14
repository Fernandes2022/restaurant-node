// const {app} = require(".");
// const connectDB = require("./config/db");



// const  PORT = 3000

// const start = async () => {
 
//  try {
//   await connectDB()
//   app.listen(PORT, () => {
//    console.log('server is listening in port'+PORT)
//   })
//  } catch (error) {
//    console.error(error)
//  }
// }


// start();




// server.js
const { app } = require("./index"); // Assuming index.js exports the Express app
const connectDB = require("./config/db"); // This function should return a Promise
const swaggerUi = require('swagger-ui-express');
const path = require('path');
const express = require('express');
const swaggerDocument = require('./docs/swagger.json');

// Use a variable to hold the connection promise
let dbConnectionPromise = null;

// Setup Swagger UI with a single configuration
app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customSiteTitle: 'Restaurant API Documentation',
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    filter: true,
    showCommonExtensions: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai'
    }
  }
}));

// Middleware to ensure database connection for every request
// This makes your routes wait for the DB connection if it's not ready
app.use(async (req, res, next) => {
    try {
        // Start connection process if not already started
        if (!dbConnectionPromise) {
            dbConnectionPromise = connectDB(); // Call connectDB, it returns a Promise
        }

        // Await the connection to ensure it's established
        // If connectDB returns the actual connection object, you can store it.
        // For Mongoose, it manages the connection internally, so just awaiting its completion is key.
        await dbConnectionPromise;

        // If connection is successful, proceed to the next middleware/route
        next();
    } catch (error) {
        console.error("Database connection error in middleware:", error);
        // Reset the promise so a new attempt can be made on the next request
        dbConnectionPromise = null;
        // Send an error response if the database connection fails
        res.status(503).send("Service Unavailable: Database connection failed.");
    }
});

// Export the app for Vercel
module.exports = app;

// Optional: Local development listener
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  // For local development, ensure the DB is connected before listening
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT} (local development)`);
      });
    })
    .catch(err => {
      console.error("Failed to connect to database locally:", err);
      process.exit(1); // Exit if DB connection fails locally
    });
}