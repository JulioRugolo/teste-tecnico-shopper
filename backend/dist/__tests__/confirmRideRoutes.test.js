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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const rideRoutes_1 = __importDefault(require("../routes/rideRoutes"));
require("../__mocks__/rideServiceMock");
// Mock do modelo Ride
jest.mock('../models/Ride', () => ({
    create: jest.fn().mockResolvedValue({
        id: 1,
        customerId: 1,
        origin: 'Origem A',
        destination: 'Destino A',
        distance: 446.263,
        duration: '5 hours 39 mins',
        driverId: 1,
        driverName: 'Homer Simpson',
        value: 1115.6575,
    }),
}));
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api/ride', rideRoutes_1.default);
describe('Teste do endpoint /api/ride/confirm', () => {
    it('Deve retornar erro 400 se a origem ou destino não forem fornecidos', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .patch('/api/ride/confirm')
            .send({
            customer_id: 1,
            distance: 446.263,
            duration: '5 hours 39 mins',
            driver: { id: 1 },
            value: 1115.6575,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem estar em branco.',
        });
    }));
    it('Deve retornar erro 404 se o motorista não for encontrado', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .patch('/api/ride/confirm')
            .send({
            customer_id: 1,
            origin: 'Origem A',
            destination: 'Destino A',
            distance: 446.263,
            duration: '5 hours 39 mins',
            driver: { id: 99 },
            value: 1115.6575,
        });
        expect(response.status).toBe(404);
        expect(response.body).toEqual({
            error_code: 'DRIVER_NOT_FOUND',
            error_description: 'Motorista não encontrado.',
        });
    }));
    it('Deve retornar status 200 e salvar a viagem com sucesso', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .patch('/api/ride/confirm')
            .send({
            customer_id: 1,
            origin: 'Origem A',
            destination: 'Destino A',
            distance: 446.263,
            duration: '5 hours 39 mins',
            driver: { id: 1 },
            value: 1115.6575,
        });
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ success: true });
    }));
});
