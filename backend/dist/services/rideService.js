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
exports.fetchRides = exports.saveRide = exports.calculateRoute = exports.getTestMessage = void 0;
const axios_1 = __importDefault(require("axios"));
const Ride_1 = __importDefault(require("../models/Ride"));
// Test Route
const getTestMessage = () => {
    return 'Ride Routes';
};
exports.getTestMessage = getTestMessage;
// Ride Estimate Route
const calculateRoute = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    const googleApiKey = process.env.GOOGLE_API_KEY;
    if (!googleApiKey) {
        throw new Error('A chave da API do Google não está configurada. Verifique o arquivo .env.');
    }
    const url = `https://maps.googleapis.com/maps/api/directions/json`;
    try {
        const response = yield axios_1.default.get(url, {
            params: {
                origin,
                destination,
                key: googleApiKey,
            },
        });
        if (response.status !== 200 || !response.data.routes || !response.data.routes.length) {
            throw new Error('Nenhuma rota encontrada ou erro na API do Google Maps.');
        }
        const route = response.data.routes[0];
        const leg = route.legs[0];
        return {
            origin: {
                latitude: leg.start_location.lat,
                longitude: leg.start_location.lng,
            },
            destination: {
                latitude: leg.end_location.lat,
                longitude: leg.end_location.lng,
            },
            distance: leg.distance.value / 1000,
            duration: leg.duration.text,
            routeResponse: route,
        };
    }
    catch (error) {
        console.error('Erro ao calcular a rota:', error.message || error);
        throw new Error('Erro ao calcular a rota. Verifique os endereços fornecidos.');
    }
});
exports.calculateRoute = calculateRoute;
// Save Ride
const saveRide = (rideData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ride = yield Ride_1.default.create({
            customerId: rideData.customer_id,
            origin: rideData.origin,
            destination: rideData.destination,
            distance: rideData.distance,
            duration: rideData.duration,
            driverId: rideData.driver_id,
            driverName: rideData.driver_name,
            value: rideData.value,
        });
        return ride;
    }
    catch (error) {
        console.error('Erro ao salvar a viagem:', error.message || error);
        throw new Error('Erro ao salvar a viagem no banco de dados.');
    }
});
exports.saveRide = saveRide;
// Fetch Ride
const fetchRides = (customer_id, driver_id) => __awaiter(void 0, void 0, void 0, function* () {
    const whereClause = { customerId: customer_id };
    if (driver_id) {
        whereClause.driverId = driver_id;
    }
    return yield Ride_1.default.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
    });
});
exports.fetchRides = fetchRides;
