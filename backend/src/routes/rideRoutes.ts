import express from 'express';
import { getTestMessage, estimateRide, confirmRide } from '../controllers/rideController';

const router = express.Router();

// Test route
router.get('/', getTestMessage);

// Route to estimate a ride
router.post('/estimate', estimateRide);

router.patch('/confirm', confirmRide);

export default router;
