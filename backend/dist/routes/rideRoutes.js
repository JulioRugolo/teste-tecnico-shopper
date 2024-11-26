"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rideController_1 = require("../controllers/rideController");
const router = express_1.default.Router();
// Test route
router.get('/', rideController_1.getTestMessage);
// Route to estimate a ride
router.post('/estimate', rideController_1.estimateRide);
// Route to confirm a ride
router.patch('/confirm', rideController_1.confirmRide);
// Route to get rides by customer
router.get('/:customer_id', rideController_1.getRidesByCustomer);
exports.default = router;
