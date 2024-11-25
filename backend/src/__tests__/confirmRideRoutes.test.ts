import request, { Response } from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import rideRoutes from '../routes/rideRoutes';
import '../__mocks__/rideServiceMock';

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

const app = express();
app.use(bodyParser.json());
app.use('/api/ride', rideRoutes);

describe('Teste do endpoint /api/ride/confirm', () => {
  it('Deve retornar erro 400 se a origem ou destino não forem fornecidos', async () => {
    const response = await request(app)
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
  });

  it('Deve retornar erro 404 se o motorista não for encontrado', async () => {
    const response = await request(app)
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
  });

  it('Deve retornar status 200 e salvar a viagem com sucesso', async () => {
    const response = await request(app)
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
  });
});
