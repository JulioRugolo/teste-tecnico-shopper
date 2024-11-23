require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importar o pacote cors
const env = require('dotenv');

// Config environment variables
env.config();

// Importing Routes
import rideRoutes from './routes/rideRoutes';

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());
app.use(cors()); // Ativar o CORS para todas as rotas

// Routes
app.use('/api/ride', rideRoutes);

// Starting server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
