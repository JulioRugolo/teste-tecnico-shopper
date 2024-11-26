import express from 'express';
import { getTestMessage, estimateRide, confirmRide, getRidesByCustomer } from '../controllers/rideController';

const router = express.Router();

// Test route
router.get('/', getTestMessage);

// Route to estimate a ride
router.post('/estimate', estimateRide);

// Route to confirm a ride
router.patch('/confirm', confirmRide);

// Route to get rides by customer
router.get('/:customer_id', getRidesByCustomer);

export default router;
