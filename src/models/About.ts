import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface AboutAttributes {
	id?: number;
	content: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface AboutInstance extends Sequelize.Instance<AboutAttributes>, AboutAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const AboutFactory: Factory<AboutInstance, AboutAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<AboutInstance, AboutAttributes> => {
	const attributes: SequelizeAttributes<AboutAttributes> = {
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		}
	};
	const About: Sequelize.Model<AboutInstance, AboutAttributes> = sequelize.define<
		AboutInstance,
		AboutAttributes
	>('about', attributes, { underscored: true });

	About.associate = (models: ModelFactoryInterface): void => {
		About.hasMany(models.Cloth, { onDelete: 'cascade' });
	};

	return About;
};
