
import express from 'express';
import fs from 'fs'
import path from 'path'
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { OrderInstance, OrderAttributes } from '../models/Order';
import { OrderClothSideAttributes } from '../models/OrderClothSide';
import { ColorSizeStockInstance } from '../models/ColorSizeStock';

export interface OrderAmount {
    color_size_stock_id: number;
    amount: number;
    size_id: number;
}

interface CreateOrder extends OrderAttributes {
    order_counts: OrderAmount[];
    cloth_sides: OrderClothSideAttributes[];
}

const ordersRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<OrderInstance> = Parser.parseQuery<OrderInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<OrderInstance> = await models.Order.findAndCountAll(parsed);
                const body: OkResponse = { data };

                res.json(body);
            },
        ),
    );

    router.get(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const order: OrderInstance | null = await models.Order.findByPk(id, {
                    include: [{
                        model: models.Color, attributes: ['id', 'color'],
                    }, {
                        model: models.Cloth, attributes: ['id', 'name', 'price']
                    }]
                });
                if (!order) throw new NotFoundError('Order tidak ditemukan');
                const body: OkResponse = { data: order };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: CreateOrder = req.body;
                const currentDate: Date = new Date();
                const totalOrderToday: OrderInstance[] = await models.Order.findAll({
                    where: {
                        created_at: currentDate
                    }
                })
                const { order_counts, cloth_sides, custom_cloth, cloth_id } = attributes;
                attributes.order_number = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}-${totalOrderToday.length + 1}`;
                // created order
                const order: OrderInstance = await models.Order.create(attributes);
                // ----
                for (let i = 0; i < order_counts.length; i++) {
                    await models.OrderCount.create({ cloth_id, amount: order_counts[i].amount, order_id: order.id, size_id: order_counts[i].size_id });
                    if (!custom_cloth) {
                        const stock: ColorSizeStockInstance | null = await models.ColorSizeStock.findByPk(order_counts[i].color_size_stock_id);
                        stock && await stock.update({ stock: stock.stock - order_counts[i].amount });
                    }
                }
                for (let i = 0; i < cloth_sides.length; i++) {
                    const { cloth_side_id, design_file, design_x, design_y, design_height, design_width, design_rotation } = cloth_sides[i];
                    const filename = `${currentDate.toISOString().replace(/\:/g, '')}[${cloth_side_id}]-[${order.id}]-[order_sides_design].png`
                    fs.writeFileSync(path.resolve(__dirname, '..', '..', 'uploads', filename), design_file.split(',')[1], 'base64');
                    await models.OrderClothSide.create({
                        design_width,
                        design_height,
                        design_y,
                        design_x,
                        design_file: filename,
                        mockup_file: filename,
                        order_id: order.id,
                        cloth_side_id,
                        design_rotation
                    });
                }
                const body: OkResponse = { data: order };

                res.json(body);
            },
        ),
    );

    router.put(
        '/:id',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const attributes: OrderAttributes = req.body;
                const order: OrderInstance | null = await models.Order.findByPk(id);
                if (!order) throw new NotFoundError('Order tidak ditemukan');
                const updatedOrder: OrderInstance = await order.update(attributes);
                const body: OkResponse = { data: updatedOrder };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const order: OrderInstance | null = await models.Order.findByPk(id);
                if (!order) throw new NotFoundError('Order tidak ditemukan');
                await order.destroy();
                const body: OkResponse = { data: order };

                res.json(body);
            },
        ),
    );

    return router;
};

export default ordersRoutes;
