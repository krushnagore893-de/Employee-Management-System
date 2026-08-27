import {
  Model,
  DataTypes,
  Sequelize,
  ModelStatic
} from "sequelize";

export class UserMapping extends Model {

  declare id: string;
  declare user_id: string;
  declare employee_id: string;
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

        user_id: {
          type: DataTypes.UUID,
          allowNull: false,
        },

        employee_id: {
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
        tableName: "user_mappings",
        timestamps: false,
      }
    );
  }
}