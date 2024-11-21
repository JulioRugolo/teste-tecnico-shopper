require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const env = require('dotenv');

// Config environment variables
env.config();

// Importing Routes
import rideRoutes from './routes/rideRoutes';

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api/ride', rideRoutes);

// Starting server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
