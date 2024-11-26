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
require('dotenv').config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = __importDefault(require("util"));
const child_process_1 = require("child_process");
const connection_1 = __importDefault(require("./config/connection"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const cors = require('cors');
// Middlewares
app.use(body_parser_1.default.json());
app.use(cors());
// Routes
const rideRoutes_1 = __importDefault(require("./routes/rideRoutes"));
const driverRoutes_1 = __importDefault(require("./routes/driverRoutes"));
app.use('/api/ride', rideRoutes_1.default);
app.use('/api/drivers', driverRoutes_1.default);
// Execute migrations and seeds
const runMigrationsAndSeeds = () => __awaiter(void 0, void 0, void 0, function* () {
    const execPromise = util_1.default.promisify(child_process_1.exec);
    try {
        console.log("Executando rollback das migrations...");
        yield execPromise("npx sequelize-cli db:migrate:undo:all");
        console.log("Rollback concluído!");
        console.log("Executando migrations...");
        yield execPromise("npx sequelize-cli db:migrate");
        console.log("Migrations executadas com sucesso!");
        console.log("Executando seeds...");
        yield execPromise("npx sequelize-cli db:seed:all");
        console.log("Seeds executadas com sucesso!");
    }
    catch (error) {
        console.error("Erro ao executar migrations ou seeds:", error.message);
        process.exit(1);
    }
});
// Test database connection
const testDatabaseConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield connection_1.default.authenticate();
    }
    catch (error) {
        console.error('Erro ao conectar com o banco de dados:', error.message);
        process.exit(1);
    }
});
// Server Start
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield testDatabaseConnection();
        yield runMigrationsAndSeeds();
        // Start server
        app.listen(port, () => {
            console.log(`Servidor rodando na porta ${port}`);
        });
    }
    catch (error) {
        console.error("Erro ao iniciar o servidor:", error.message);
        process.exit(1);
    }
}))();
