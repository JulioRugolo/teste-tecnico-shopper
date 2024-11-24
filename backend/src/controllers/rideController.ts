import { Request, Response } from 'express';
import { calculateRoute } from '../services/rideService';
import { getAllDrivers } from '../services/driverService'; // Importa o serviço de motoristas

export const getTestMessage = (req: Request, res: Response): void => {
  res.send('Ride Routes');
};

// Endpoint POST /ride/estimate
export const estimateRide = async (req: Request, res: Response): Promise<void> => {
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
    const routeResponse = await calculateRoute(origin, destination);
    const { distance, duration, origin: originCoordinates, destination: destinationCoordinates } = routeResponse;

    // Search for all drivers
    const drivers = await getAllDrivers();

    // Filter drivers by minimum distance
    const availableDrivers = drivers
      .filter((driver: any) => distance >= driver.minKm)
      .map((driver: any) => ({
        id: driver.id,
        name: driver.name,
        description: driver.description,
        vehicle: driver.vehicle,
        review: driver.review,
        value: distance * driver.rate,
      }))
      .sort((a: any, b: any) => a.value - b.value);

    // Client response
    res.status(200).json({
      origin: originCoordinates,
      destination: destinationCoordinates,
      distance,
      duration,
      options: availableDrivers,
    });
  } catch (error) {
    console.error('Erro no cálculo da rota ou ao buscar motoristas:', error);
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
    });
  }
};
