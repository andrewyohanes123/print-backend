
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { ColorInstance, ColorAttributes } from '../models/Color';

const colorsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<ColorInstance> = Parser.parseQuery<ColorInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<ColorInstance> = await models.Color.findAndCountAll(parsed);
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
                const color: ColorInstance | null = await models.Color.findByPk(id);
                if (!color) throw new NotFoundError('Color tidak ditemukan');
                const body: OkResponse = { data: color };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: ColorAttributes = req.body;
                const color: ColorInstance = await models.Color.create(attributes);
                const body: OkResponse = { data: color };

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
                const attributes: ColorAttributes = req.body;
                const color: ColorInstance | null = await models.Color.findByPk(id);
                if (!color) throw new NotFoundError('Color tidak ditemukan');
                const updatedColor: ColorInstance = await color.update(attributes);
                const body: OkResponse = { data: updatedColor };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const color: ColorInstance | null = await models.Color.findByPk(id);
                if (!color) throw new NotFoundError('Color tidak ditemukan');
                await color.destroy();
                const body: OkResponse = { data: color };

                res.json(body);
            },
        ),
    );

    return router;
};

export default colorsRoutes;
    