"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRide = void 0;
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
exports.saveRide = jest.fn().mockResolvedValue({
    id: 1,
    customerId: 1,
    origin: 'Origem A',
    destination: 'Destino A',
    distance: 446.263,
    duration: '5 hours 39 mins',
    driverId: 1,
    driverName: 'Homer Simpson',
    value: 1115.6575,
});
jest.mock('../services/driverService', () => ({
    getAllDrivers: jest.fn().mockResolvedValue([
        {
            id: 1,
            name: 'Homer Simpson',
            minKm: 50,
            rate: 2.5,
        },
        {
            id: 2,
            name: 'Dominic Toretto',
            minKm: 100,
            rate: 5.0,
        },
        {
            id: 3,
            name: 'Michael Knight',
            minKm: 80,
            rate: 4.0,
        },
    ]),
    getDriverById: jest.fn().mockImplementation((id) => {
        const drivers = [
            {
                id: 1,
                name: 'Homer Simpson',
                minKm: 50,
                rate: 2.5,
            },
            {
                id: 2,
                name: 'Dominic Toretto',
                minKm: 100,
                rate: 5.0,
            },
            {
                id: 3,
                name: 'Michael Knight',
                minKm: 80,
                rate: 4.0,
            },
        ];
        return Promise.resolve(drivers.find((driver) => driver.id === id) || null);
    }),
}));
jest.mock('../services/rideService', () => ({
    saveRide: jest.fn().mockResolvedValue({
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
