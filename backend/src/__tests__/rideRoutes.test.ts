import request from 'supertest';
import express from 'express';
import rideRoutes from '../routes/rideRoutes';

const app = express();
app.use('/api/ride', rideRoutes);

describe('Teste inicial da rota /api/ride', () => {
  it('Deve retornar "Ride Routes"', async () => {
    const response = await request(app).get('/api/ride');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Ride Routes');
  });
});
