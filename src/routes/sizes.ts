
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { SizeInstance, SizeAttributes } from '../models/Size';

const sizesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<SizeInstance> = Parser.parseQuery<SizeInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<SizeInstance> = await models.Size.findAndCountAll(parsed);
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
                const size: SizeInstance | null = await models.Size.findByPk(id);
                if (!size) throw new NotFoundError('Size tidak ditemukan');
                const body: OkResponse = { data: size };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: SizeAttributes = req.body;
                const size: SizeInstance = await models.Size.create(attributes);
                const body: OkResponse = { data: size };

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
                const attributes: SizeAttributes = req.body;
                const size: SizeInstance | null = await models.Size.findByPk(id);
                if (!size) throw new NotFoundError('Size tidak ditemukan');
                const updatedSize: SizeInstance = await size.update(attributes);
                const body: OkResponse = { data: updatedSize };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const size: SizeInstance | null = await models.Size.findByPk(id);
                if (!size) throw new NotFoundError('Size tidak ditemukan');
                await size.destroy();
                const body: OkResponse = { data: size };

                res.json(body);
            },
        ),
    );

    return router;
};

export default sizesRoutes;
    