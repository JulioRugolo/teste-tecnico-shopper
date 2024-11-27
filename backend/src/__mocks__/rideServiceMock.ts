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
}));

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
  getDriverById: jest.fn().mockImplementation((id: number) => {
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

jest.mock('../models/Ride', () => ({
  findAll: jest.fn(),
}));
