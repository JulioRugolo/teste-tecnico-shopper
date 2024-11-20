require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

// Importing Routes
const routes = require('./routes/exampleRoutes');

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Starting server
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
