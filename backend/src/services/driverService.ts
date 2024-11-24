import Driver from '../models/Driver';

export const getAllDrivers = async () => {
  try {
    return await Driver.findAll();
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    throw new Error('Failed to fetch drivers');
  }
};
