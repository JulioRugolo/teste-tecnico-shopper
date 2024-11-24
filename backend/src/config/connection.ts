import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Driver from '../models/Driver';

dotenv.config();

// Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_database',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASS || 'default_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log,
    define: {
        underscored: false,
      },
  }
);

// Test the connection
(async () => {
  try {
    await sequelize.authenticate();
    Driver.initModel(sequelize);
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
  } catch (error: any) {
    console.error('Erro ao conectar com o banco de dados:', error.message);
    process.exit(1);
  }
})();

export default sequelize;
