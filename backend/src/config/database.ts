import { Sequelize } from 'sequelize';

// Configuração da conexão com o banco de dados
const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_database',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASS || 'default_password',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
  }
);

export default sequelize;
