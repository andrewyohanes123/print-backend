
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { ColorSizeStockInstance, ColorSizeStockAttributes } from '../models/ColorSizeStock';

const colorsizestocksRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<ColorSizeStockInstance> = Parser.parseQuery<ColorSizeStockInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<ColorSizeStockInstance> = await models.ColorSizeStock.findAndCountAll(parsed);
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
                const colorsizestock: ColorSizeStockInstance | null = await models.ColorSizeStock.findByPk(id);
                if (!colorsizestock) throw new NotFoundError('ColorSizeStock tidak ditemukan');
                const body: OkResponse = { data: colorsizestock };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: ColorSizeStockAttributes = req.body;
                const colorsizestock: ColorSizeStockInstance = await models.ColorSizeStock.create(attributes);
                const body: OkResponse = { data: colorsizestock };

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
                const attributes: ColorSizeStockAttributes = req.body;
                const colorsizestock: ColorSizeStockInstance | null = await models.ColorSizeStock.findByPk(id);
                if (!colorsizestock) throw new NotFoundError('ColorSizeStock tidak ditemukan');
                const updatedColorSizeStock: ColorSizeStockInstance = await colorsizestock.update(attributes);
                const body: OkResponse = { data: updatedColorSizeStock };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const colorsizestock: ColorSizeStockInstance | null = await models.ColorSizeStock.findByPk(id);
                if (!colorsizestock) throw new NotFoundError('ColorSizeStock tidak ditemukan');
                await colorsizestock.destroy();
                const body: OkResponse = { data: colorsizestock };

                res.json(body);
            },
        ),
    );

    return router;
};

export default colorsizestocksRoutes;
    