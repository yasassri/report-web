const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const getRoutes = require('./src/routes/getRoutes');

const app = express();
const port = 8080;

app.use(cors());

async function getAccessToken() {
  const tokenUrl = process.env.APPOINTMENTS_OAUTH_TOKEN_URL;
  const clientId = process.env.APPOINTMENTS_OAUTH_CLIENT_ID;
  const clientSecret = process.env.APPOINTMENTS_OAUTH_CLIENT_SECRET;

  try {
      const accessToken = await authenticate(tokenUrl, clientId, clientSecret);
      return accessToken;
  } catch (error) {
      console.error('Error obtaining access token:', error);
      throw error; // Rethrow the error to handle it in the calling context
  }
}

app.use('/api/v1', getRoutes);

// Catch all errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
  });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
  });

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down gracefully');
    server.close(() => {
      console.log('Server has been gracefully terminated');
    });
  });

app.listen(port, () => {
    require('dotenv').config();
    console.log(`Server is running on port ${port}`);
});