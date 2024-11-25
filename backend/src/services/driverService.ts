import Driver from '../models/Driver';

export const getAllDrivers = async () => {
  try {
    return await Driver.findAll();
  } catch (error) {
    console.error('Erro ao buscar motoristas:', error);
    throw new Error('Failed to fetch drivers');
  }
};

export const getDriverById = async (id: number): Promise<any> => {
  try {
    const driver = await Driver.findByPk(id);
    return driver ? driver.toJSON() : null;
  } catch (error) {
    console.error('Erro ao buscar motorista por ID:', error);
    throw new Error('Failed to fetch driver');
  }
};
