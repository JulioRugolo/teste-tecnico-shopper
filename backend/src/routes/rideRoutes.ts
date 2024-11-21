import express from 'express';
import { getTestMessage, estimateRide } from '../controllers/rideController';

const router = express.Router();

// Test route
router.get('/', getTestMessage);

// Route to estimate a ride
router.post('/estimate', estimateRide);

export default router;
