
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { ClothInstance, ClothAttributes } from '../models/Cloth';

const clothsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<ClothInstance> = Parser.parseQuery<ClothInstance>(
                    // @ts-ignore
                    req.query.q,
                    models,
                );
                const data: PaginatedResult<ClothInstance> = await models.Cloth.findAndCountAll(parsed);
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
                const cloth: ClothInstance | null = await models.Cloth.findByPk(id);
                if (!cloth) throw new NotFoundError('Cloth tidak ditemukan');
                const body: OkResponse = { data: cloth };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: ClothAttributes = req.body;
                const cloth: ClothInstance = await models.Cloth.create(attributes);
                const body: OkResponse = { data: cloth };

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
                const attributes: ClothAttributes = req.body;
                const cloth: ClothInstance | null = await models.Cloth.findByPk(id);
                if (!cloth) throw new NotFoundError('Cloth tidak ditemukan');
                const updatedCloth: ClothInstance = await cloth.update(attributes);
                const body: OkResponse = { data: updatedCloth };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const cloth: ClothInstance | null = await models.Cloth.findByPk(id);
                if (!cloth) throw new NotFoundError('Cloth tidak ditemukan');
                await cloth.destroy();
                const body: OkResponse = { data: cloth };

                res.json(body);
            },
        ),
    );

    return router;
};

export default clothsRoutes;
    