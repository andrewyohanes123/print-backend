
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { OrderClothSideInstance, OrderClothSideAttributes } from '../models/OrderClothSide';

const orderclothsidesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<OrderClothSideInstance> = Parser.parseQuery<OrderClothSideInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<OrderClothSideInstance> = await models.OrderClothSide.findAndCountAll(parsed);
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
                const orderclothside: OrderClothSideInstance | null = await models.OrderClothSide.findByPk(id);
                if (!orderclothside) throw new NotFoundError('OrderClothSide tidak ditemukan');
                const body: OkResponse = { data: orderclothside };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: OrderClothSideAttributes = req.body;
                const orderclothside: OrderClothSideInstance = await models.OrderClothSide.create(attributes);
                const body: OkResponse = { data: orderclothside };

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
                const attributes: OrderClothSideAttributes = req.body;
                const orderclothside: OrderClothSideInstance | null = await models.OrderClothSide.findByPk(id);
                if (!orderclothside) throw new NotFoundError('OrderClothSide tidak ditemukan');
                const updatedOrderClothSide: OrderClothSideInstance = await orderclothside.update(attributes);
                const body: OkResponse = { data: updatedOrderClothSide };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const orderclothside: OrderClothSideInstance | null = await models.OrderClothSide.findByPk(id);
                if (!orderclothside) throw new NotFoundError('OrderClothSide tidak ditemukan');
                await orderclothside.destroy();
                const body: OkResponse = { data: orderclothside };

                res.json(body);
            },
        ),
    );

    return router;
};

export default orderclothsidesRoutes;
    