import express from 'express';
import { getTestMessage } from '../controllers/rideController';

const router = express.Router();

// Test Route
router.get('/', getTestMessage);

export default router;
