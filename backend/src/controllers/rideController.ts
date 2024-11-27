import { Request, Response } from 'express';
import { calculateRoute, fetchRides } from '../services/rideService';
import { getAllDrivers, getDriverById } from '../services/driverService';
import { saveRide } from '../services/rideService';
import Ride from '../models/Ride';
import axios from 'axios';

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

export const confirmRide = async (req: Request, res: Response): Promise<void> => {
  const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

  if (!origin || !destination) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Os endereços de origem e destino não podem estar em branco.",
    });
    return;
  }

  if (!customer_id) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "O id do usuário não pode estar em branco.",
    });
    return;
  }

  if (!driver || !driver.id) {
    res.status(400).json({
      error_code: "INVALID_DATA",
      error_description: "Uma opção de motorista válida deve ser informada.",
    });
    return;
  }

  try {
    const parseCoordinates = (coordString: string) => {
      const [latitude, longitude] = coordString.split(',').map(Number);
      if (isNaN(latitude) || isNaN(longitude)) {
        throw new Error(`Coordenadas inválidas: ${coordString}`);
      }
      return { latitude, longitude };
    };

    const originCoords = parseCoordinates(origin);
    const destinationCoords = parseCoordinates(destination);

    if (
      originCoords.latitude === destinationCoords.latitude &&
      originCoords.longitude === destinationCoords.longitude
    ) {
      res.status(400).json({
        error_code: "INVALID_DATA",
        error_description: "Os endereços de origem e destino não podem ser o mesmo.",
      });
      return;
    }

    const getCityNameFromCoordinates = async (latitude: number, longitude: number): Promise<string> => {
      const apiKey = process.env.GOOGLE_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
    
      try {
        const response = await axios.get(url);
    
        if (response.data.results.length > 0) {
          const addressComponents = response.data.results[0].address_components;
          const city =
            addressComponents.find((component: any) =>
              component.types.includes("locality")
            )?.long_name ||
            addressComponents.find((component: any) =>
              component.types.includes("administrative_area_level_2")
            )?.long_name;
    
          return city || "Desconhecido";
        } else {
          console.error("Nenhum resultado encontrado para as coordenadas:", latitude, longitude);
          return "Desconhecido";
        }
      } catch (error: any) {
        console.error("Erro ao obter o nome da cidade:", error.message || error);
        return "Desconhecido";
      }
    };
    const originCity = await getCityNameFromCoordinates(originCoords.latitude, originCoords.longitude);
    const destinationCity = await getCityNameFromCoordinates(destinationCoords.latitude, destinationCoords.longitude);

    const selectedDriver = await getDriverById(driver.id);

    if (!selectedDriver) {
      res.status(404).json({
        error_code: "DRIVER_NOT_FOUND",
        error_description: "Motorista não encontrado.",
      });
      return;
    }

    if (distance < selectedDriver.minKm) {
      res.status(406).json({
        error_code: "INVALID_DISTANCE",
        error_description: `A distância informada (${distance} km) é menor que a distância mínima exigida pelo motorista (${selectedDriver.minKm} km).`,
      });
      return;
    }

    await saveRide({
      customer_id,
      origin: originCity,
      destination: destinationCity,
      distance,
      duration,
      driver_id: selectedDriver.id,
      driver_name: selectedDriver.name,
      value,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Erro ao confirmar a viagem:", error.message || error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao processar a solicitação. Tente novamente mais tarde.",
    });
  }
};


export const getRidesByCustomer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id } = req.params;
    const { driver_id } = req.query;

    // Validate input data
    if (!customer_id || customer_id === 'undefined') {
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
      const driver = await getDriverById(Number(driver_id));
      if (!driver) {
        res.status(400).json({
          error_code: 'INVALID_DRIVER',
          error_description: 'O ID do motorista fornecido não existe.',
        });
        return;
      }
    }

    // Build Where 
    const whereClause: any = { customerId: customer_id };
    if (driver_id) {
      whereClause.driverId = driver_id;
    }

    // Fetch rides
    const rides = await Ride.findAll({
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
  } catch (error) {
    console.error('Erro ao buscar viagens:', error);
    res.status(500).json({
      error_code: 'INTERNAL_SERVER_ERROR',
      error_description: 'Erro interno do servidor.',
    });
  }
};
