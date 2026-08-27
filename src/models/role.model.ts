import { Model,DataTypes,Sequelize,ModelStatic,} from "sequelize";

export class Role extends Model {
  declare id: string;
  declare role_name: string;
  declare description?: string;
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

        role_name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        description: {
          type: DataTypes.TEXT,
          allowNull: true,
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
        tableName: "roles",
        timestamps: false,
      }
    );
  }
}