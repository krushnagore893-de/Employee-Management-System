import { Model, DataTypes, Sequelize, ModelStatic } from "sequelize";


export class Employee extends Model {
  declare id: string;
  declare first_name: string;
  declare middle_name?: string;
  declare last_name: string;
  declare email: string;
  declare phone: string;
  declare salary: number;
  declare joining_date: Date;
  declare company_id: string;
  declare department_id: string;
  declare role_id: string;
  declare is_active: boolean;
  declare is_deleted: boolean;
  declare created_at: Date;
  declare updated_at: Date;

  static associate?: (
    models: Record<string, ModelStatic<Model>>
  ) => void;

  static initModel(sequelize: Sequelize) {
    return this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },

        first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        middle_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },

        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        phone: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        salary: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },

        joining_date: {
          type: DataTypes.DATE,
          allowNull: false,
        },

        company_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        department_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        role_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        is_active: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
        },

        is_deleted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },

        created_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },

        updated_at: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "employees",
        timestamps: false,
      }
    );
  }
}