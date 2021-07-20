import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface ClothAttributes {
	id?: number;
	name: string;
  price: number;
	brand_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface ClothInstance extends Sequelize.Instance<ClothAttributes>, ClothAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const ClothFactory: Factory<ClothInstance, ClothAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ClothInstance, ClothAttributes> => {
	const attributes: SequelizeAttributes<ClothAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
    price: {
      type: DataTypes.INTEGER(32),
      allowNull: false
    }
	};
	const Cloth: Sequelize.Model<ClothInstance, ClothAttributes> = sequelize.define<
		ClothInstance,
		ClothAttributes
	>('cloth', attributes, { underscored: true });

	Cloth.associate = (models: ModelFactoryInterface): void => {
		Cloth.belongsTo(models.Brand, { onDelete: 'cascade' });
		Cloth.hasMany(models.Order, { onDelete: 'cascade' });
	};

	return Cloth;
};
