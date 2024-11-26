"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const driverController_1 = require("../controllers/driverController");
const router = (0, express_1.Router)();
router.get('/', driverController_1.fetchAllDrivers);
// get driver by id
router.get('/:id', driverController_1.fetchDriverById);
exports.default = router;
