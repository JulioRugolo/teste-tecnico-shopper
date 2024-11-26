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
exports.getRidesByCustomer = exports.confirmRide = exports.estimateRide = exports.getTestMessage = void 0;
const rideService_1 = require("../services/rideService");
const driverService_1 = require("../services/driverService");
const rideService_2 = require("../services/rideService");
const Ride_1 = __importDefault(require("../models/Ride"));
const getTestMessage = (req, res) => {
    res.send('Ride Routes');
};
exports.getTestMessage = getTestMessage;
// Endpoint POST /ride/estimate
const estimateRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { origin, destination, customer_id: userId } = req.body;
    // Validate request data
    if (!origin || !destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem estar em branco.',
        });
        return;
    }
    if (!userId) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'O id do usuário não pode estar em branco.',
        });
        return;
    }
    if (origin === destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem ser o mesmo.',
        });
        return;
    }
    try {
        // Calculate route
        const routeResponse = yield (0, rideService_1.calculateRoute)(origin, destination);
        const { distance, duration, origin: originCoordinates, destination: destinationCoordinates } = routeResponse;
        // Search for all drivers
        const drivers = yield (0, driverService_1.getAllDrivers)();
        // Filter drivers by minimum distance
        const availableDrivers = drivers
            .filter((driver) => distance >= driver.minKm)
            .map((driver) => ({
            id: driver.id,
            name: driver.name,
            description: driver.description,
            vehicle: driver.vehicle,
            review: driver.review,
            value: distance * driver.rate,
        }))
            .sort((a, b) => a.value - b.value);
        // Client response
        res.status(200).json({
            origin: originCoordinates,
            destination: destinationCoordinates,
            distance,
            duration,
            options: availableDrivers,
            routeResponse: routeResponse.routeResponse,
        });
    }
    catch (error) {
        console.error('Erro no cálculo da rota ou ao buscar motoristas:', error);
        res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
        });
    }
});
exports.estimateRide = estimateRide;
// Confirm ride
const confirmRide = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
    // Validações
    if (!origin || !destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem estar em branco.',
        });
        return;
    }
    if (!customer_id) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'O id do usuário não pode estar em branco.',
        });
        return;
    }
    if (origin === destination) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Os endereços de origem e destino não podem ser o mesmo.',
        });
        return;
    }
    if (!driver || !driver.id) {
        res.status(400).json({
            error_code: 'INVALID_DATA',
            error_description: 'Uma opção de motorista válida deve ser informada.',
        });
        return;
    }
    try {
        // Search for the selected driver by ID
        const selectedDriver = yield (0, driverService_1.getDriverById)(driver.id);
        if (!selectedDriver) {
            res.status(404).json({
                error_code: 'DRIVER_NOT_FOUND',
                error_description: 'Motorista não encontrado.',
            });
            return;
        }
        // Validate distance
        if (distance < selectedDriver.minKm) {
            res.status(406).json({
                error_code: 'INVALID_DISTANCE',
                error_description: `A distância informada (${distance} km) é menor que a distância mínima exigida pelo motorista (${selectedDriver.minKm} km).`,
            });
            return;
        }
        // Save ride
        yield (0, rideService_2.saveRide)({
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver_id: selectedDriver.id,
            driver_name: selectedDriver.name,
            value,
        });
        // Response to the client
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Erro ao confirmar a viagem:', error);
        res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
        });
    }
});
exports.confirmRide = confirmRide;
const getRidesByCustomer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.params;
        const { driver_id } = req.query;
        // Validate input data
        if (!customer_id) {
            res.status(400).json({
                error_code: 'INVALID_CUSTOMER',
                error_description: 'O ID do cliente não pode estar em branco.',
            });
            return;
        }
        if (driver_id && isNaN(Number(driver_id))) {
            res.status(400).json({
                error_code: 'INVALID_DRIVER',
                error_description: 'O ID do motorista deve ser um número válido.',
            });
            return;
        }
        // Validate driver ID
        if (driver_id) {
            const driver = yield (0, driverService_1.getDriverById)(Number(driver_id));
            if (!driver) {
                res.status(400).json({
                    error_code: 'INVALID_DRIVER',
                    error_description: 'O ID do motorista fornecido não existe.',
                });
                return;
            }
        }
        // Build Where 
        const whereClause = { customerId: customer_id };
        if (driver_id) {
            whereClause.driverId = driver_id;
        }
        // Fetch rides
        const rides = yield Ride_1.default.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
        });
        // Check if there are rides
        if (!rides || rides.length === 0) {
            res.status(404).json({
                error_code: 'NO_RIDES_FOUND',
                error_description: 'Nenhuma viagem encontrada para este usuário.',
            });
            return;
        }
        // Response to the client
        const response = {
            customer_id,
            rides: rides.map((ride) => ({
                id: ride.id,
                date: ride.createdAt,
                origin: ride.origin,
                destination: ride.destination,
                distance: ride.distance,
                duration: ride.duration,
                driver: {
                    id: ride.driverId,
                    name: ride.driverName,
                },
                value: ride.value,
            })),
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error('Erro ao buscar viagens:', error);
        res.status(500).json({
            error_code: 'INTERNAL_SERVER_ERROR',
            error_description: 'Erro interno do servidor.',
        });
    }
});
exports.getRidesByCustomer = getRidesByCustomer;
