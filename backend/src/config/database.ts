import { Sequelize } from "sequelize";

console.log("Database Config:", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASS: process.env.DB_PASS,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
});

const sequelize = new Sequelize(
  process.env.DB_NAME || "default_database",
  process.env.DB_USER || "default_user",
  process.env.DB_PASS || "default_password",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: console.log, // Ativa logs SQL para depuração
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexão com o banco de dados estabelecida com sucesso!");
  } catch (error: any) {
    console.error("Erro ao conectar com o banco de dados:", error.message);
    process.exit(1); // Encerre o processo em caso de erro
  }
})();

export default sequelize;
