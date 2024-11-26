"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Driver extends sequelize_1.Model {
    static initModel(sequelize) {
        Driver.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: sequelize_1.DataTypes.TEXT,
                allowNull: false,
            },
            vehicle: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
            },
            rate: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            minKm: {
                type: sequelize_1.DataTypes.FLOAT,
                allowNull: false,
            },
            review: {
                type: sequelize_1.DataTypes.JSON,
                allowNull: false,
            },
        }, {
            sequelize,
            modelName: 'Driver',
            tableName: 'Drivers',
            timestamps: true,
        });
        return Driver;
    }
}
exports.default = Driver;
