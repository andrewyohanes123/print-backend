import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface BrandAttributes {
	id?: number;
	name: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface BrandInstance extends Sequelize.Instance<BrandAttributes>, BrandAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const BrandFactory: Factory<BrandInstance, BrandAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<BrandInstance, BrandAttributes> => {
	const attributes: SequelizeAttributes<BrandAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		}
	};
	const Brand: Sequelize.Model<BrandInstance, BrandAttributes> = sequelize.define<
		BrandInstance,
		BrandAttributes
	>('brand', attributes, { underscored: true });

	Brand.associate = (models: ModelFactoryInterface): void => {
		Brand.hasMany(models.Cloth, { onDelete: 'cascade' });
	};

	return Brand;
};
