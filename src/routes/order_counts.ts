
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { OrderCountInstance, OrderCountAttributes } from '../models/OrderCount';

const ordercountsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<OrderCountInstance> = Parser.parseQuery<OrderCountInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<OrderCountInstance> = await models.OrderCount.findAndCountAll(parsed);
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
                const ordercount: OrderCountInstance | null = await models.OrderCount.findByPk(id);
                if (!ordercount) throw new NotFoundError('OrderCount tidak ditemukan');
                const body: OkResponse = { data: ordercount };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: OrderCountAttributes = req.body;
                const ordercount: OrderCountInstance = await models.OrderCount.create(attributes);
                const body: OkResponse = { data: ordercount };

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
                const attributes: OrderCountAttributes = req.body;
                const ordercount: OrderCountInstance | null = await models.OrderCount.findByPk(id);
                if (!ordercount) throw new NotFoundError('OrderCount tidak ditemukan');
                const updatedOrderCount: OrderCountInstance = await ordercount.update(attributes);
                const body: OkResponse = { data: updatedOrderCount };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const ordercount: OrderCountInstance | null = await models.OrderCount.findByPk(id);
                if (!ordercount) throw new NotFoundError('OrderCount tidak ditemukan');
                await ordercount.destroy();
                const body: OkResponse = { data: ordercount };

                res.json(body);
            },
        ),
    );

    return router;
};

export default ordercountsRoutes;
    