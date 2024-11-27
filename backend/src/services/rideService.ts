import axios from 'axios';
import Ride from '../models/Ride';

// Test Route
export const getTestMessage = (): string => {
  return 'Ride Routes';
};

// Ride Estimate Route
export const calculateRoute = async (origin: string, destination: string) => {
  const googleApiKey = process.env.GOOGLE_API_KEY;

  if (!googleApiKey) {
    throw new Error('A chave da API do Google não está configurada. Verifique o arquivo .env.');
  }

  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  try {
    const response = await axios.get(url, {
      params: {
        origin,
        destination,
        key: googleApiKey,
      },
    });

    if (response.status !== 200 || !response.data.routes || !response.data.routes.length) {
      throw new Error('Nenhuma rota encontrada ou erro na API do Google Maps.');
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      origin: {
        latitude: leg.start_location.lat,
        longitude: leg.start_location.lng,
      },
      destination: {
        latitude: leg.end_location.lat,
        longitude: leg.end_location.lng,
      },
      distance: leg.distance.value / 1000,
      duration: leg.duration.text,
      routeResponse: route,
    };
  } catch (error: any) {
    console.error('Erro ao calcular a rota:', error.message || error);
    throw new Error('Erro ao calcular a rota. Verifique os endereços fornecidos.');
  }
};


// Save Ride
export const saveRide = async (rideData: {
  customer_id: number;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number;
  driver_name: string;
  value: number;
}) => {
  try {
    const ride = await Ride.create({
      customerId: rideData.customer_id,
      origin: rideData.origin,
      destination: rideData.destination,
      distance: rideData.distance,
      duration: rideData.duration,
      driverId: rideData.driver_id,
      driverName: rideData.driver_name,
      value: rideData.value,
    });

    return ride;
  } catch (error: any) {
    console.error('Erro ao salvar a viagem:', error.message || error);
    throw new Error('Erro ao salvar a viagem no banco de dados.');
  }
};

// Fetch Ride
export const fetchRides = async (customer_id: string, driver_id?: string) => {
  const whereClause: any = { customerId: customer_id };
  if (driver_id) {
    whereClause.driverId = driver_id;
  }

  return await Ride.findAll({
    where: whereClause,
    order: [['createdAt', 'DESC']],
  });
};