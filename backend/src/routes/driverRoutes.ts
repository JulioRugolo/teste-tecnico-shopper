import { Router } from 'express';
import { fetchAllDrivers, fetchDriverById } from '../controllers/driverController';

const router = Router();

router.get('/', fetchAllDrivers);

// get driver by id
router.get('/:id', fetchDriverById);

export default router;
