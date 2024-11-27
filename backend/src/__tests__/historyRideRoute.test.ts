import request from 'supertest';
import app from '../server';
import Ride from '../models/Ride';
import { getDriverById } from '../services/driverService';
import '../__mocks__/rideServiceMock';

describe('GET /rides/:customer_id', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar 400 se o ID do cliente não for fornecido', async () => {
    const response = await request(app).get('/api/ride/undefined');

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      error_code: 'INVALID_CUSTOMER',
      error_description: 'O ID do cliente não pode estar em branco.',
    });
  });

  it('deve retornar 404 se não houver viagens', async () => {
    (Ride.findAll as jest.Mock).mockResolvedValue([]);

    const response = await request(app).get('/api/ride/123');

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      error_code: 'NO_RIDES_FOUND',
      error_description: 'Nenhuma viagem encontrada para este usuário.',
    });
  });

  it('deve retornar 200 com a lista de viagens', async () => {
    (Ride.findAll as jest.Mock).mockResolvedValue([
      {
        id: 1,
        createdAt: new Date().toISOString(),
        origin: 'Origem A',
        destination: 'Destino A',
        distance: 10.5,
        duration: '15 min',
        driverId: 1,
        driverName: 'Homer Simpson',
        value: 50,
      },
    ]);

    const response = await request(app).get('/api/ride/123');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      customer_id: '123',
      rides: [
        {
          id: 1,
          date: expect.any(String),
          origin: 'Origem A',
          destination: 'Destino A',
          distance: 10.5,
          duration: '15 min',
          driver: {
            id: 1,
            name: 'Homer Simpson',
          },
          value: 50,
        },
      ],
    });
  });
});
