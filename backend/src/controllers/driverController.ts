import { Request, Response } from 'express';
import { getAllDrivers, getDriverById } from '../services/driverService';

export const fetchAllDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const drivers = await getAllDrivers();
    res.status(200).json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// get driver by id, endpoint GET /driver/:id
export const fetchDriverById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const driver = await getDriverById(Number(id));
    if (!driver) {
      res.status(404).json({ error: 'Driver not found' });
      return;
    }

    res.status(200).json(driver);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
