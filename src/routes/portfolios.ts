
import express from 'express';
import fs from 'fs';
import path from 'path';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { PortfolioInstance, PortfolioAttributes } from '../models/Portfolio';
import { upload } from './cloth_sides';

const portfoliosRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<PortfolioInstance> = Parser.parseQuery<PortfolioInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<PortfolioInstance> = await models.Portfolio.findAndCountAll(parsed);
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
                const portfolio: PortfolioInstance | null = await models.Portfolio.findByPk(id);
                if (!portfolio) throw new NotFoundError('Portfolio tidak ditemukan');
                const body: OkResponse = { data: portfolio };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        upload.single('picture'),
        // validation,

        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const currentDate = new Date().toISOString().replace(/\:/g, '');
                const attributes: PortfolioAttributes = req.body;
                const filename: string = `[Portfolio] ${currentDate}.png`;
                const fileData: string = attributes.picture.split(',')[1];
                fs.writeFileSync(path.resolve(__dirname, '..', '..', 'uploads', filename), fileData, 'base64');
                const portfolio: PortfolioInstance = await models.Portfolio.create({ picture: filename });
                const body: OkResponse = { data: portfolio };

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
                const attributes: PortfolioAttributes = req.body;
                const portfolio: PortfolioInstance | null = await models.Portfolio.findByPk(id);
                if (!portfolio) throw new NotFoundError('Portfolio tidak ditemukan');
                const updatedPortfolio: PortfolioInstance = await portfolio.update(attributes);
                const body: OkResponse = { data: updatedPortfolio };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const portfolio: PortfolioInstance | null = await models.Portfolio.findByPk(id);
                if (!portfolio) throw new NotFoundError('Portfolio tidak ditemukan');
                await portfolio.destroy();
                const body: OkResponse = { data: portfolio };

                res.json(body);
            },
        ),
    );

    return router;
};

export default portfoliosRoutes;
