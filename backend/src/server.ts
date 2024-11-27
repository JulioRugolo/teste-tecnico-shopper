require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import util from 'util';
import { exec } from 'child_process';
import sequelize from './config/connection';

const app = express();
const port = process.env.PORT || 8080;
const cors = require('cors');

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
import rideRoutes from './routes/rideRoutes';
import driverRoutes from './routes/driverRoutes';
app.use('/api/ride', rideRoutes);
app.use('/api/drivers', driverRoutes);

if (process.env.NODE_ENV !== 'test') {
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

  // Test database connection
  const testDatabaseConnection = async () => {
    try {
      await sequelize.authenticate();
    } catch (error: any) {
      console.error('Erro ao conectar com o banco de dados:', error.message);
      process.exit(1);
    }
  };

  // Server Start
  (async () => {
    try {
      await testDatabaseConnection();
      await runMigrationsAndSeeds();

      // Start server
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    } catch (error: any) {
      console.error("Erro ao iniciar o servidor:", error.message);
      process.exit(1);
    }
  })();
}

export default app;
