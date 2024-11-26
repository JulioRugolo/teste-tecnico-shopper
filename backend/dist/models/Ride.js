"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Ride extends sequelize_1.Model {
    static initModel(sequelize) {
        Ride.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            customerId: {
                type: sequelize_1.DataTypes.INTEGER,
                field: 'customer_id',
                allowNull: false,
            },
            origin: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            destination: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            distance: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            duration: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            driverId: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                field: 'driver_id',
            },
            driverName: {
                type: sequelize_1.DataTypes.STRING,
                field: 'driver_name',
                allowNull: false,
            },
            value: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Ride',
            tableName: 'Rides',
            timestamps: true, // Define timestamps automáticos
            underscored: true, // Usa snake_case
        });
        return Ride;
    }
}
exports.default = Ride;
