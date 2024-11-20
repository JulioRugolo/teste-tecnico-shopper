import { Request, Response } from 'express';

// Controller Test Route
export const getTestMessage = (req: Request, res: Response): void => {
  res.send('Ride Routes');
};
