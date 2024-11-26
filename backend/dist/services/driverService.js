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
exports.getDriverById = exports.getAllDrivers = void 0;
const Driver_1 = __importDefault(require("../models/Driver"));
const getAllDrivers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield Driver_1.default.findAll();
    }
    catch (error) {
        console.error('Erro ao buscar motoristas:', error);
        throw new Error('Failed to fetch drivers');
    }
});
exports.getAllDrivers = getAllDrivers;
const getDriverById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = yield Driver_1.default.findByPk(id);
        return driver ? driver.toJSON() : null;
    }
    catch (error) {
        console.error('Erro ao buscar motorista por ID:', error);
        throw new Error('Failed to fetch driver');
    }
});
exports.getDriverById = getDriverById;
