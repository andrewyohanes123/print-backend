import Sequelize from 'sequelize';
import { UserInstance, UserAttributes } from '../User';
import { TokenInstance, TokenAttributes } from '../Token';
import { ClothAttributes, ClothInstance } from '../Cloth';
import { OrderAttributes, OrderInstance } from '../Order';
import { ColorAttributes, ColorInstance } from '../Color';
import { OrderCountAttributes, OrderCountInstance } from '../OrderCount';
import { PortfolioAttributes, PortfolioInstance } from '../Portfolio';
import { AboutAttributes, AboutInstance } from '../About';
import { ClothSideAttributes, ClothSideInstance } from '../ClothSide';
import { OrderClothSideAttributes, OrderClothSideInstance } from '../OrderClothSide';
import { SizeAttributes, SizeInstance } from '../Size';
import { ColorSizeStockAttributes, ColorSizeStockInstance } from '../ColorSizeStock';

interface Obj {
	[s: string]: any;
}

export default interface ModelFactoryInterface extends Obj {
	sequelize: Sequelize.Sequelize;
	Sequelize: Sequelize.SequelizeStatic;
	User: Sequelize.Model<UserInstance, UserAttributes>;
	Token: Sequelize.Model<TokenInstance, TokenAttributes>;
	Cloth: Sequelize.Model<ClothInstance, ClothAttributes>;
	Order: Sequelize.Model<OrderInstance, OrderAttributes>;
	Color: Sequelize.Model<ColorInstance, ColorAttributes>;
	OrderCount: Sequelize.Model<OrderCountInstance, OrderCountAttributes>;
	Portfolio: Sequelize.Model<PortfolioInstance, PortfolioAttributes>;
	About: Sequelize.Model<AboutInstance, AboutAttributes>;
	ClothSide: Sequelize.Model<ClothSideInstance, ClothSideAttributes>;
	OrderClothSide: Sequelize.Model<OrderClothSideInstance, OrderClothSideAttributes>;
	Size: Sequelize.Model<SizeInstance, SizeAttributes>;
	ColorSizeStock: Sequelize.Model<ColorSizeStockInstance, ColorSizeStockAttributes>;
}
