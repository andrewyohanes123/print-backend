import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface OrderClothSideAttributes {
  id?: number;
  design_file: string;
  design_width: number;
  design_height: number;
  design_x: number;
  design_y: number;
  design_rotation: number;
  mockup_file: string;
  order_id?: number;
  cloth_side_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderClothSideInstance extends Sequelize.Instance<OrderClothSideAttributes>, OrderClothSideAttributes {
}

export interface Associate {
  (models: ModelFactoryInterface): void;
}

export const OrderClothSideFactory: Factory<OrderClothSideInstance, OrderClothSideAttributes> = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<OrderClothSideInstance, OrderClothSideAttributes> => {
  const attributes: SequelizeAttributes<OrderClothSideAttributes> = {
    design_file: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    design_height: {
      type: DataTypes.INTEGER(32),
      allowNull: false,
    },
    design_width: {
      type: DataTypes.INTEGER(32),
      allowNull: false
    },
    mockup_file: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    design_x: {
      type: DataTypes.INTEGER(32),
      allowNull: false
    },
    design_y: {
      type: DataTypes.INTEGER(32),
      allowNull: false
    },
    design_rotation: {
      type: DataTypes.DOUBLE(32),
      allowNull: false,
      defaultValue: 0
    }
  };
  const OrderClothSide: Sequelize.Model<OrderClothSideInstance, OrderClothSideAttributes> = sequelize.define<
    OrderClothSideInstance,
    OrderClothSideAttributes
  >('order_cloth_side', attributes, { underscored: true });

  OrderClothSide.associate = (models: ModelFactoryInterface): void => {
    OrderClothSide.belongsTo(models.Cloth, { onDelete: 'cascade' });
    OrderClothSide.belongsTo(models.ClothSide, { onDelete: 'cascade' });
  };

  return OrderClothSide;
};
