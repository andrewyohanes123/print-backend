
import express from 'express';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { AboutInstance, AboutAttributes } from '../models/About';

const aboutsRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<AboutInstance> = Parser.parseQuery<AboutInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<AboutInstance> = await models.About.findAndCountAll(parsed);
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
                const about: AboutInstance | null = await models.About.findByPk(id);
                if (!about) throw new NotFoundError('About tidak ditemukan');
                const body: OkResponse = { data: about };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: AboutAttributes = req.body;
                const about: AboutInstance = await models.About.create(attributes);
                const body: OkResponse = { data: about };

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
                const attributes: AboutAttributes = req.body;
                const about: AboutInstance | null = await models.About.findByPk(id);
                if (!about) throw new NotFoundError('About tidak ditemukan');
                const updatedAbout: AboutInstance = await about.update(attributes);
                const body: OkResponse = { data: updatedAbout };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const about: AboutInstance | null = await models.About.findByPk(id);
                if (!about) throw new NotFoundError('About tidak ditemukan');
                await about.destroy();
                const body: OkResponse = { data: about };

                res.json(body);
            },
        ),
    );

    return router;
};

export default aboutsRoutes;
    