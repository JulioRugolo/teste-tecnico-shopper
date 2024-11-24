import { Request, Response } from 'express';
import { getAllDrivers } from '../services/driverService';

export const fetchAllDrivers = async (req: Request, res: Response): Promise<void> => {
  try {
    const drivers = await getAllDrivers();
    res.status(200).json(drivers);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
