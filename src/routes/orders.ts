
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { OrderInstance, OrderAttributes } from '../models/Order';

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
                const order: OrderInstance | null = await models.Order.findByPk(id);
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
                const attributes: OrderAttributes = req.body;
                const order: OrderInstance = await models.Order.create(attributes);
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
    