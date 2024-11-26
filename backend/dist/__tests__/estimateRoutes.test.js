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
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use('/api/ride', rideRoutes_1.default);
// Mock dos serviços externos
jest.mock('../services/rideService', () => ({
    calculateRoute: jest.fn().mockResolvedValue({
        origin: {
            latitude: -23.5557813,
            longitude: -46.6395371,
        },
        destination: {
            latitude: -22.9068576,
            longitude: -43.1729362,
        },
        distance: 446.263,
        duration: '5 hours 39 mins',
        routeResponse: {},
    }),
}));
jest.mock('../services/driverService', () => ({
    getAllDrivers: jest.fn().mockResolvedValue([
        {
            id: 1,
            name: 'Homer Simpson',
            description: 'Olá! Sou o Homer, seu motorista camarada!',
            vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
            review: {
                rating: 2,
                comment: 'Motorista simpático, mas errou o caminho 3 vezes.',
            },
            rate: 2.5,
            minKm: 50,
        },
        {
            id: 2,
            name: 'Dominic Toretto',
            description: 'Ei, aqui é o Dom.',
            vehicle: 'Dodge Charger R/T 1970 modificado',
            review: {
                rating: 4,
                comment: 'Que viagem incrível!',
            },
            rate: 5.0,
            minKm: 100,
        },
        {
            id: 3,
            name: 'James Bond',
            description: 'Boa noite, sou James Bond.',
            vehicle: 'Aston Martin DB5 clássico',
            review: {
                rating: 5,
                comment: 'Serviço impecável!',
            },
            rate: 10.0,
            minKm: 200,
        },
    ]),
}));
describe('Teste dos dados recebidos no endpoint /api/ride/estimate', () => {
    it('Deve retornar erro 400 se a origem não for fornecida', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/ride/estimate')
            .send({
            destination: 'Destino A',
            customer_id: 1,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem estar em branco.',
        });
    }));
    it('Deve retornar erro 400 se o destino não for fornecido', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/ride/estimate')
            .send({
            origin: 'Origem A',
            customer_id: 1,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem estar em branco.',
        });
    }));
    it('Deve retornar erro 400 se o customer_id não for fornecido', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/ride/estimate')
            .send({
            origin: 'Origem A',
            destination: 'Destino A',
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error_code: 'INVALID_DATA',
            error_description: 'O id do usuário não pode estar em branco.',
        });
    }));
    it('Deve retornar erro 400 se a origem for igual ao destino', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app)
            .post('/api/ride/estimate')
            .send({
            origin: 'Mesmo Lugar',
            destination: 'Mesmo Lugar',
            customer_id: 1,
        });
        expect(response.status).toBe(400);
        expect(response.body).toEqual({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem ser o mesmo.',
        });
    }));
});
describe('Teste do endpoint /api/ride/estimate', () => {
    let response;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        response = yield (0, supertest_1.default)(app)
            .post('/api/ride/estimate')
            .send({
            origin: 'Origem A',
            destination: 'Destino A',
            customer_id: 1,
        });
    }));
    it('Deve retornar status 200', () => {
        expect(response.status).toBe(200);
    });
    it('Deve conter a propriedade "origin" com latitude e longitude corretas', () => {
        expect(response.body).toHaveProperty('origin');
        expect(response.body.origin).toHaveProperty('latitude', -23.5557813);
        expect(response.body.origin).toHaveProperty('longitude', -46.6395371);
    });
    it('Deve conter a propriedade "destination" com latitude e longitude corretas', () => {
        expect(response.body).toHaveProperty('destination');
        expect(response.body.destination).toHaveProperty('latitude', -22.9068576);
        expect(response.body.destination).toHaveProperty('longitude', -43.1729362);
    });
    it('Deve conter a propriedade "distance" com o valor correto', () => {
        expect(response.body).toHaveProperty('distance', 446.263);
    });
    it('Deve conter a propriedade "duration" com o valor correto', () => {
        expect(response.body).toHaveProperty('duration', '5 hours 39 mins');
    });
    it('Deve conter a propriedade "options" como uma lista de motoristas disponíveis', () => {
        expect(response.body).toHaveProperty('options');
        expect(Array.isArray(response.body.options)).toBe(true);
        expect(response.body.options.length).toBe(3);
    });
    it('Cada item em "options" deve conter as propriedades esperadas', () => {
        const option = response.body.options[0];
        expect(option).toHaveProperty('id', 1);
        expect(option).toHaveProperty('name', 'Homer Simpson');
        expect(option).toHaveProperty('description');
        expect(option).toHaveProperty('vehicle');
        expect(option).toHaveProperty('review');
        expect(option).toHaveProperty('value');
    });
    it('Deve conter a propriedade "routeResponse" como um objeto', () => {
        expect(response.body).toHaveProperty('routeResponse');
        expect(typeof response.body.routeResponse).toBe('object');
    });
});
