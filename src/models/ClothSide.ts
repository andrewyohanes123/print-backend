import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface ClothSideAttributes {
	id?: number;
	name: string;
  cloth_base: string;
  cloth_background: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface ClothSideInstance extends Sequelize.Instance<ClothSideAttributes>, ClothSideAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const ClothSideFactory: Factory<ClothSideInstance, ClothSideAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<ClothSideInstance, ClothSideAttributes> => {
	const attributes: SequelizeAttributes<ClothSideAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
    cloth_base: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    cloth_background: {
      type: DataTypes.TEXT,
      allowNull: false
    }
	};
	const ClothSide: Sequelize.Model<ClothSideInstance, ClothSideAttributes> = sequelize.define<
		ClothSideInstance,
		ClothSideAttributes
	>('cloth_side', attributes, { underscored: true });

	ClothSide.associate = (models: ModelFactoryInterface): void => {
		ClothSide.belongsTo(models.Cloth, { onDelete: 'cascade' });
	};

	return ClothSide;
};
