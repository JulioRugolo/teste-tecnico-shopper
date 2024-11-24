// src/models/index.ts
import { Sequelize } from 'sequelize';
import Driver from './Driver'; // Importe o modelo Driver

// Configuração da instância do Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME || 'default_database',
  process.env.DB_USER || 'default_user',
  process.env.DB_PASS || 'default_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log, // Logs SQL para depuração
  }
);

// Registro dos modelos
const models = {
  Driver: Driver.initModel(sequelize), // Chame uma função estática para inicializar o modelo
};

// Função para sincronizar os modelos
const syncModels = async () => {
  try {
    // await sequelize.sync({ force: false }); // Use "force: false" para evitar recriação de tabelas
    // console.log('Modelos sincronizados com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar os modelos:', error);
    process.exit(1);
  }
};

export { sequelize, models, syncModels };
