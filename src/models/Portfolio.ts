import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface PortfolioAttributes {
	id?: number;
	picture: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface PortfolioInstance extends Sequelize.Instance<PortfolioAttributes>, PortfolioAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const PortfolioFactory: Factory<PortfolioInstance, PortfolioAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<PortfolioInstance, PortfolioAttributes> => {
	const attributes: SequelizeAttributes<PortfolioAttributes> = {
		picture: {
			type: DataTypes.TEXT,
			allowNull: false,
		}
	};
	const Portfolio: Sequelize.Model<PortfolioInstance, PortfolioAttributes> = sequelize.define<
		PortfolioInstance,
		PortfolioAttributes
	>('portfolio', attributes, { underscored: true });

	Portfolio.associate = (models: ModelFactoryInterface): void => {
	};

	return Portfolio;
};
