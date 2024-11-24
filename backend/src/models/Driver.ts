import { DataTypes, Model, Sequelize } from 'sequelize';

class Driver extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public vehicle!: string;
  public rate!: number;
  public minKm!: number;
  public review!: { rating: number; comment: string };

  static initModel(sequelize: Sequelize): typeof Driver {
    Driver.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        vehicle: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        rate: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        minKm: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        review: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Driver',
        tableName: 'Drivers',
        timestamps: true,
      }
    );
    return Driver;
  }
}

export default Driver;
