import { Model,DataTypes,Sequelize,ModelStatic,} from "sequelize";

export class Company extends Model {
  declare id: string; 
  declare company_name: string;
  declare email: string;
  declare phone: string; 
  declare address: string;
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

        company_name: {
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

        address: {
          type: DataTypes.STRING,
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
        tableName: "companies",
        timestamps: false,
      }
    );
  }
}