// Service Route Test
import axios from 'axios';

// Test Route
export const getTestMessage = (): string => {
  return 'Ride Routes';
};

// Ride Estimate Route
export const calculateRoute = async (origin: string, destination: string) => {
  const googleApiKey = process.env.GOOGLE_API_KEY;
  
  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  const response = await axios.get(url, {
    params: {
      origin,
      destination,
      key: googleApiKey,
    },
  });
  

  if (response.status !== 200 || !response.data.routes.length) {
    throw new Error('Erro ao calcular rota');
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
};
  