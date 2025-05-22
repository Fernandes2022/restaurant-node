const express = require('express');
const connectDB = require('./config/db');
const { app } = require('./index'); // routes + middleware defined here
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');
const mongoose = require('mongoose');

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui.css',
  customJs: [
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-bundle.js',
    'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.18.3/swagger-ui-standalone-preset.js'
  ],
  explorer: true,
  customSiteTitle: 'Restaurant API Docs',
  swaggerOptions: {
    docExpansion: 'list',
    filter: true,
    displayRequestDuration: true,
    persistAuthorization: true
  }
}));

// Ensure DB is connected before any request is handled
let connectPromise = connectDB();

app.use(async (req, res, next) => {
  try {
    await connectPromise;
    next();
  } catch (err) {
    console.error('DB connection error:', err);
    res.status(503).json({ error: 'Database unavailable' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// For local dev: run server

const PORT = process.env.PORT || 3000;
let server;

const startServer = async () => {
  if (require.main === module) {
    try {
      await connectPromise;
      server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch {
      console.log('Server startup failed');
    }
  }
}

const shutDown = async () => {
  if(server) {
    server.close(() => {
      console.log('server closed')
    })
  }

  try {
    await mongoose.connection.close(false);
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error closing MongoDB connection:', err);
  }
  
  process.exit(0);
}

// Handle both SIGINT and SIGTERM signals
process.on('SIGINT', shutDown);
process.on('SIGTERM', shutDown);

// For local development
if (require.main === module) {
  startServer();
}

// For Vercel (exports app directly)
module.exports = app;