const { app } = require('./index');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

// Swagger UI via CDN for Vercel compatibility
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

// Middleware to wait for DB connection
let dbConnectionPromise = null;

app.use(async (req, res, next) => {
  try {
    if (!dbConnectionPromise) {
      dbConnectionPromise = connectDB();
    }
    await dbConnectionPromise;
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    dbConnectionPromise = null;
    res.status(503).send('Service Unavailable: DB connection failed');
  }
});

// Local dev server
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error('DB connection failed locally:', err);
      process.exit(1);
    });
}

// For Vercel
module.exports = app;
