require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
import { syncModels } from './models/index';
import rideRoutes from './routes/rideRoutes';
import util from "util";
import { exec } from "child_process";
import './config/database';

env.config();


const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

const runMigrationsAndSeeds = async () => {
  const execPromise = util.promisify(exec);
  console.log("Executando migrations e seeds...");
  await execPromise("npx sequelize-cli db:migrate");
  await execPromise("npx sequelize-cli db:seed:all");
};
// Sincronizar modelos antes de iniciar o servidor
(async () => {
  runMigrationsAndSeeds();
})();

// Rotas
app.use('/api/ride', rideRoutes);


// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});

