import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Driver from '../models/Driver';
import Ride from '../models/Ride';

dotenv.config();

let sequelize: Sequelize;

if (process.env.NODE_ENV === 'test') {
  // Configuração para o ambiente de teste
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false, // Desabilita logs no ambiente de teste
  });
} else {
  // Configuração para outros ambientes (desenvolvimento ou produção)
  sequelize = new Sequelize(
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
}

const initializeModels = () => {
  try {
    Driver.initModel(sequelize);
    Ride.initModel(sequelize);
  } catch (error: any) {
    console.error('Erro ao inicializar os modelos:', error.message);
  }
};

if (process.env.NODE_ENV !== 'test') {
  (async () => {
    try {
      await sequelize.authenticate();
      initializeModels();
      console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error: any) {
      console.error('Erro ao conectar com o banco de dados:', error.message);
      process.exit(1);
    }
  })();
} else {
  initializeModels();
}

export default sequelize;
