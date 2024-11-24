import { Router } from 'express';
import { fetchAllDrivers } from '../controllers/driverController';

const router = Router();

router.get('/', fetchAllDrivers);

export default router;
