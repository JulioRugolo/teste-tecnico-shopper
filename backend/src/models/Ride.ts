import { DataTypes, Model, Sequelize } from 'sequelize';

class Ride extends Model {
  public id!: number;
  public customerId!: string;
  public origin!: string;
  public destination!: string;
  public distance!: number;
  public duration!: string;
  public driverId!: number;
  public driverName!: string;
  public value!: number;

  public createdAt!: Date;
  public updatedAt!: Date;

  static initModel(sequelize: Sequelize): typeof Ride {
    Ride.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        customerId: {
            type: DataTypes.INTEGER,
            field: 'customer_id',
            allowNull: false,
          },
        origin: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        destination: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        distance: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        duration: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        driverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: 'driver_id',
        },
        driverName: {
            type: DataTypes.STRING,
            field: 'driver_name',
            allowNull: false,
          },
        value: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'Ride',
        tableName: 'Rides',
        timestamps: true, // Define timestamps automáticos
        underscored: true, // Usa snake_case
      }
    );
    return Ride;
  }
}

export default Ride;
