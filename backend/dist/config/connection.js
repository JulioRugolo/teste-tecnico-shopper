"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
const Driver_1 = __importDefault(require("../models/Driver"));
const Ride_1 = __importDefault(require("../models/Ride"));
dotenv_1.default.config();
// Sequelize connection
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'default_database', process.env.DB_USER || 'default_user', process.env.DB_PASS || 'default_password', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: console.log,
    define: {
        underscored: false,
    },
});
// Test the connection
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield sequelize.authenticate();
        Driver_1.default.initModel(sequelize);
        Ride_1.default.initModel(sequelize);
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    }
    catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error.message);
        process.exit(1);
    }
}))();
exports.default = sequelize;
