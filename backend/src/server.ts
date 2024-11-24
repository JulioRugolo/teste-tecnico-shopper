require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv');
import util from "util";
import { exec } from "child_process";
import './config/database';

env.config();

const app = express();
const port = process.env.PORT || 8080;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
import rideRoutes from './routes/rideRoutes';
app.use('/api/ride', rideRoutes);


// Execute migrations and seeds
const runMigrationsAndSeeds = async () => {
  const execPromise = util.promisify(exec);
  try {
    console.log("Executando rollback das migrations...");
    await execPromise("npx sequelize-cli db:migrate:undo:all");
    console.log("Rollback concluído!");

    console.log("Executando migrations...");
    await execPromise("npx sequelize-cli db:migrate");
    console.log("Migrations executadas com sucesso!");

    console.log("Executando seeds...");
    await execPromise("npx sequelize-cli db:seed:all");
    console.log("Seeds executadas com sucesso!");
  } catch (error: any) {
    console.error("Erro ao executar migrations ou seeds:", error.message);
    process.exit(1);
  }
};


// Server Start
(async () => {
  try {
    await runMigrationsAndSeeds();
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error: any) {
    console.error("Erro ao iniciar o servidor:", error.message);
    process.exit(1);
  }
})();



