import Sequelize from 'sequelize';
import ModelFactoryInterface from './typings/ModelFactoryInterface';
import { UserFactory } from './User';
import { TokenFactory } from './Token';
import { ClothFactory } from './Cloth';
import { OrderFactory } from './Order';
import { OrderCountFactory } from './OrderCount';
import { ColorFactory } from './Color';
import { PortfolioFactory } from './Portfolio';
import { AboutFactory } from './About';
import { ClothSideFactory } from './ClothSide';
import { OrderClothSideFactory } from './OrderClothSide';
import { ColorSizeStockFactory } from './ColorSizeStock';
import { SizeFactory } from './Size';

const createModels: Function = (): ModelFactoryInterface => {
	const {
		DB_HOST,
		DB_DIALECT,
		DB_DATABASE = 'sirius',
		DB_USER = 'sirius',
		DB_PASS = 'sirius',
	}: NodeJS.ProcessEnv = process.env;
	const sequelize: Sequelize.Sequelize = new Sequelize(DB_DATABASE, DB_USER, DB_PASS, {
		host: DB_HOST,
		dialect: DB_DIALECT,
		dialectOptions: {
			useUTC: true,
		},
		timezone: '+08:00',
		operatorsAliases: true,
		logging: process.env.SYSTEM_LOGGING === 'true' ? console.log : (msg: string) => { },
	});
	const db: ModelFactoryInterface = {
		sequelize,
		Sequelize,
		User: UserFactory(sequelize, Sequelize),
		Token: TokenFactory(sequelize, Sequelize),
		Cloth: ClothFactory(sequelize, Sequelize),
		Order: OrderFactory(sequelize, Sequelize),
		OrderCount: OrderCountFactory(sequelize, Sequelize),
		Color: ColorFactory(sequelize, Sequelize),
		Portfolio: PortfolioFactory(sequelize, Sequelize),
		About: AboutFactory(sequelize, Sequelize),
		ClothSide: ClothSideFactory(sequelize, Sequelize),
		OrderClothSide: OrderClothSideFactory(sequelize, Sequelize),
		ColorSizeStock: ColorSizeStockFactory(sequelize, Sequelize),
		Size: SizeFactory(sequelize, Sequelize)
	};

	Object.keys(db).forEach(
		(model: string): void => {
			if (db[model].associate) {
				db[model].associate(db);
			}
		},
	);

	return db;
};

export default createModels;
