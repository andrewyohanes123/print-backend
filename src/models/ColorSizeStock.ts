import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface ColorSizeStockAttributes {
	id?: number;
	stock: number;
	cloth_id?: number;
  size_id?: number;
  color_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface ColorSizeStockInstance extends Sequelize.Instance<ColorSizeStockAttributes>, ColorSizeStockAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const ColorSizeStockFactory: Factory<ColorSizeStockInstance, ColorSizeStockAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ColorSizeStockInstance, ColorSizeStockAttributes> => {
	const attributes: SequelizeAttributes<ColorSizeStockAttributes> = {
		stock : {
      type: DataTypes.INTEGER(32),
      allowNull: false,
    }
	};
	const ColorSizeStock: Sequelize.Model<ColorSizeStockInstance, ColorSizeStockAttributes> = sequelize.define<
		ColorSizeStockInstance,
		ColorSizeStockAttributes
	>('color_size_stock', attributes, { underscored: true });

	ColorSizeStock.associate = (models: ModelFactoryInterface): void => {
		ColorSizeStock.belongsTo(models.Cloth, { onDelete: 'cascade' });
		ColorSizeStock.belongsTo(models.Size, { onDelete: 'cascade' });
		ColorSizeStock.belongsTo(models.Color, { onDelete: 'cascade' });
	};

	return ColorSizeStock;
};
