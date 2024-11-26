"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDriverById = exports.fetchAllDrivers = void 0;
const driverService_1 = require("../services/driverService");
const fetchAllDrivers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const drivers = yield (0, driverService_1.getAllDrivers)();
        res.status(200).json(drivers);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.fetchAllDrivers = fetchAllDrivers;
// get driver by id, endpoint GET /driver/:id
const fetchDriverById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const driver = yield (0, driverService_1.getDriverById)(Number(id));
        if (!driver) {
            res.status(404).json({ error: 'Driver not found' });
            return;
        }
        res.status(200).json(driver);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.fetchDriverById = fetchDriverById;
