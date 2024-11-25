import { Request, Response } from 'express';
import { calculateRoute } from '../services/rideService';
import { getAllDrivers, getDriverById } from '../services/driverService';
import { saveRide } from '../services/rideService';

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
      routeResponse: routeResponse.routeResponse,
    });
  } catch (error) {
    console.error('Erro no cálculo da rota ou ao buscar motoristas:', error);
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
    });
  }
};

// Confirm ride
export const confirmRide = async (req: Request, res: Response): Promise<void> => {
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
    const selectedDriver = await getDriverById(driver.id);

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
    await saveRide({
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
  } catch (error) {
    console.error('Erro ao confirmar a viagem:', error);
    res.status(500).json({
      error_code: 'SERVER_ERROR',
      error_description: 'Erro ao processar a solicitação. Tente novamente mais tarde.',
    });
  }
};
