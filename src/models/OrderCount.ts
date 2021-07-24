import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface OrderCountAttributes {
  id?: number;
  amount: number;
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  order_id?: number;
  cloth_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface OrderCountInstance extends Sequelize.Instance<OrderCountAttributes>, OrderCountAttributes {
}

export interface Associate {
  (models: ModelFactoryInterface): void;
}

export const OrderCountFactory: Factory<OrderCountInstance, OrderCountAttributes> = (
  sequelize: Sequelize.Sequelize,
  DataTypes: Sequelize.DataTypes,
): Sequelize.Model<OrderCountInstance, OrderCountAttributes> => {
  const attributes: SequelizeAttributes<OrderCountAttributes> = {
    amount: {
      type: DataTypes.INTEGER(32),
      allowNull: false,
    },
    size: {
      type: DataTypes.ENUM(['S', 'M', 'L', 'XL', 'XXL']),
      allowNull: false,
      defaultValue: 'M'
    }
  };
  const OrderCount: Sequelize.Model<OrderCountInstance, OrderCountAttributes> = sequelize.define<
    OrderCountInstance,
    OrderCountAttributes
  >('order_count', attributes, { underscored: true });

  OrderCount.associate = (models: ModelFactoryInterface): void => {
    OrderCount.belongsTo(models.Order, { onDelete: 'cascade' });
    OrderCount.belongsTo(models.Cloth, { onDelete: 'cascade' });
  };

  return OrderCount;
};
