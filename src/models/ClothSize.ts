import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface ClothSizeAttributes {
	id?: number;
	size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  price: number;
	cloth_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface ClothSizeInstance extends Sequelize.Instance<ClothSizeAttributes>, ClothSizeAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const ClothSizeFactory: Factory<ClothSizeInstance, ClothSizeAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ClothSizeInstance, ClothSizeAttributes> => {
	const attributes: SequelizeAttributes<ClothSizeAttributes> = {
		size: {
			type: DataTypes.ENUM(['S', 'M', 'L', 'XL', 'XXL']),
			allowNull: false,
		},
    price: {
      type: DataTypes.INTEGER(32),
      allowNull: false,
    }
	};
	const ClothSize: Sequelize.Model<ClothSizeInstance, ClothSizeAttributes> = sequelize.define<
		ClothSizeInstance,
		ClothSizeAttributes
	>('cloth_size', attributes, { underscored: true });

	ClothSize.associate = (models: ModelFactoryInterface): void => {
		ClothSize.belongsTo(models.Cloth, { onDelete: 'cascade' });
		ClothSize.hasMany(models.Order, { onDelete: 'cascade' });
	};

	return ClothSize;
};
