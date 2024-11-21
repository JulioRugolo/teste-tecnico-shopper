import { Request, Response } from 'express';
import { calculateRoute } from '../services/rideService';

// Controller Test Route
export const getTestMessage = (req: Request, res: Response): void => {
  res.send('Ride Routes');
};

// Available Drivers
const drivers = [
  {
    id: 1,
    name: 'Homer Simpson',
    description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
    vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
    review: { rating: 2, comment: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.' },
    rate: 2.5,
    minKm: 1,
  },
  {
    id: 2,
    name: 'Dominic Toretto',
    description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
    vehicle: 'Dodge Charger R/T 1970 modificado',
    review: { rating: 4, comment: 'Que viagem incrível! O carro é um show à parte e o motorista foi super gente boa. Recomendo!' },
    rate: 5.0,
    minKm: 5,
  },
  {
    id: 3,
    name: 'James Bond',
    description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
    vehicle: 'Aston Martin DB5 clássico',
    review: { rating: 5, comment: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.' },
    rate: 10.0,
    minKm: 10,
  },
];

// Endpoint POST /ride/estimate
export const estimateRide = async (req: Request, res: Response): Promise<void> => {
  const { origin, destination, customer_id: userId } = req.body;

  // Data Validation
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
    const routeResponse = await calculateRoute(origin, destination);

    // Route Response Destruction
    const { distance, duration, origin: originCoordinates, destination: destinationCoordinates } = routeResponse;

    // Filter Available Drivers
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
      routeResponse,
    });
  } catch (error) {
    res.status(500).json({
      error_code: 'ROUTE_CALCULATION_ERROR',
      error_description: 'Erro ao calcular a rota. Verifique os dados fornecidos.',
    });
  }
};
