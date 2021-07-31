import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface SizeAttributes {
	id?: number;
	size: "S" | "M" | "L" | "XL" | "XXL";
	cloth_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface SizeInstance extends Sequelize.Instance<SizeAttributes>, SizeAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const SizeFactory: Factory<SizeInstance, SizeAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<SizeInstance, SizeAttributes> => {
	const attributes: SequelizeAttributes<SizeAttributes> = {
		size: {
      type: DataTypes.ENUM(["S", "M", "L", "XL", "XXL"]),
      allowNull: false,
      defaultValue: "M"
    }
	};
	const Size: Sequelize.Model<SizeInstance, SizeAttributes> = sequelize.define<
		SizeInstance,
		SizeAttributes
	>('Size', attributes, { underscored: true });

	Size.associate = (models: ModelFactoryInterface): void => {
		Size.belongsTo(models.Cloth, { onDelete: 'cascade' });
		Size.hasMany(models.ColorSizeStock, { onDelete: 'cascade' });
	};

	return Size;
};
