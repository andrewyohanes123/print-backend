import Sequelize from 'sequelize';
import { SequelizeAttributes } from './typings/SequelizeAttributes';
import { Factory } from './typings/ModelInterface';
import ModelFactoryInterface from './typings/ModelFactoryInterface';

export interface OrderAttributes {
	id?: number;
	name: string;
	email: string;
	phone: string;
	status?: "Menunggu Konfirmasi" | "Sementara Diproses" | "Pesanan Selesai";
	custom_cloth: boolean;
	description?: string;
	cloth_id?: number;
	color_id?: number;
	order_number: string;
	receipt_file?: string;
	created_at?: Date;
	updated_at?: Date;
}

export interface OrderInstance extends Sequelize.Instance<OrderAttributes>, OrderAttributes {
}

export interface Associate {
	(models: ModelFactoryInterface): void;
}

export const OrderFactory: Factory<OrderInstance, OrderAttributes> = (
	sequelize: Sequelize.Sequelize,
	DataTypes: Sequelize.DataTypes,
): Sequelize.Model<OrderInstance, OrderAttributes> => {
	const attributes: SequelizeAttributes<OrderAttributes> = {
		name: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING(191),
			allowNull: false
		},
		phone: {
			type: DataTypes.STRING(191),
			allowNull: false
		},
		status: {
			type: DataTypes.ENUM(["Menunggu Konfirmasi", "Sementara Diproses", "Pesanan Selesai"]),
			allowNull: true,
			defaultValue: "Menunggu Konfirmasi"
		},
		order_number: {
			type: DataTypes.STRING(191),
			allowNull: false,
		},
		custom_cloth: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		receipt_file: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	};
	const Order: Sequelize.Model<OrderInstance, OrderAttributes> = sequelize.define<
		OrderInstance,
		OrderAttributes
	>('order', attributes, { underscored: true });

	Order.associate = (models: ModelFactoryInterface): void => {
		Order.hasMany(models.OrderCount, { onDelete: 'cascade' });
		Order.hasMany(models.OrderClothSide, { onDelete: 'cascade' });
		Order.belongsTo(models.Cloth, { onDelete: 'cascade' });
		Order.belongsTo(models.Color, { onDelete: 'cascade' });
		// Order.belongsTo(models.User, { onDelete: 'cascade' });
	};

	return Order;
};
