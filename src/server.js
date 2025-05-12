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
const { app } = require("./index"); // Assuming index.js is in the same directory as server.js
const connectDB = require("./config/db");

// Connect to DB. For Vercel, this will run during cold starts.
// You might consider a more robust connection management for serverless environments
// to avoid excessive connections on repeated invocations, but for a basic setup, this is often fine.
connectDB().catch(err => {
  console.error("Database connection failed:", err);
  // Consider throwing an error or exiting if DB connection is critical at startup
});

// Export the app directly for Vercel
module.exports = app;

// Optional: This part is for local development only.
// It ensures the server only listens on a port when run directly (e.g., `node server.js`).
if (require.main === module) {
  const PORT = process.env.PORT || 3000; // Use process.env.PORT for local too
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT} (for local development)`);
  });
}