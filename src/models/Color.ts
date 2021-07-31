import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface ColorAttributes {
	id?: number;
  name: string;
	color: string;
	cloth_id?: number;
	created_at?: Date;
	updated_at?: Date;
}

export interface ColorInstance extends Sequelize.Instance<ColorAttributes>, ColorAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const ColorFactory: Factory<ColorInstance, ColorAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ColorInstance, ColorAttributes> => {
	const attributes: SequelizeAttributes<ColorAttributes> = {
    name: {
      type: DataTypes.STRING(191),
      allowNull: false
    },
		color: {
			type: DataTypes.STRING(191),
			allowNull: false,
		}
	};
	const Color: Sequelize.Model<ColorInstance, ColorAttributes> = sequelize.define<
		ColorInstance,
		ColorAttributes
	>('color', attributes, { underscored: true });

	Color.associate = (models: ModelFactoryInterface): void => {
		Color.belongsTo(models.Cloth, { onDelete: 'cascade' });
		Color.hasMany(models.ColorSizeStock, { onDelete: 'cascade' });
	};

	return Color;
};
