
import express from 'express';
import fs from 'fs'
import path from 'path'
import multer from 'multer'
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes } from './typings/RouteInterface';
import a from '../middlewares/wrapper/a';
import { OkResponse } from './typings/BodyBuilderInterface';
import { PaginatedResult } from './typings/QueryInterface';
import sequelize from 'sequelize';
import { Parser } from '../helpers/Parser';
import NotFoundError from '../classes/NotFoundError';
import { ClothSideInstance, ClothSideAttributes } from '../models/ClothSide';

export const multerStorage: multer.StorageEngine = multer.diskStorage({
    filename: (req, file, cb) => {
        const date = new Date().toISOString().replace(/\:/g, '');
        cb(null, `${date}-[${file.fieldname}]-${file.originalname}`);
    },
    destination: path.resolve(__dirname, '..', '..', 'uploads')
})

export type multerFiles = { [fieldname: string]: Express.Multer.File[] };

export const upload: multer.Multer = multer({storage: multerStorage});

const clothsidesRoutes: Routes = (
    app: express.Application,
    models: ModelFactoryInterface,
): express.Router => {
    const router: express.Router = express.Router();

    router.get(
        '/',
        Parser.validateQ(),
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const parsed: sequelize.FindOptions<ClothSideInstance> = Parser.parseQuery<ClothSideInstance>(
                    `${req.query.q}`,
                    models,
                );
                const data: PaginatedResult<ClothSideInstance> = await models.ClothSide.findAndCountAll(parsed);
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
                const clothside: ClothSideInstance | null = await models.ClothSide.findByPk(id);
                if (!clothside) throw new NotFoundError('ClothSide tidak ditemukan');
                const body: OkResponse = { data: clothside };

                res.json(body);
            },
        ),
    );

    router.post(
        '/',
        upload.fields([{name: 'cloth_base', maxCount: 1}, {name: 'cloth_background', maxCount: 1}]),
        // validation,
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const attributes: ClothSideAttributes = req.body;
                const files = req.files as multerFiles;
                // console.log(files)
                Object.keys(files).forEach((file: string) => {
                    // @ts-ignore
                    attributes[file as keyof typeof attributes] = files[file][0].filename;
                })
                const clothside: ClothSideInstance = await models.ClothSide.create(attributes);
                const body: OkResponse = { data: clothside };

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
                const attributes: ClothSideAttributes = req.body;
                const clothside: ClothSideInstance | null = await models.ClothSide.findByPk(id);
                if (!clothside) throw new NotFoundError('ClothSide tidak ditemukan');
                const updatedClothSide: ClothSideInstance = await clothside.update(attributes);
                const body: OkResponse = { data: updatedClothSide };

                res.json(body);
            },
        ),
    );

    router.delete(
        '/:id',
        a(
            async (req: express.Request, res: express.Response): Promise<void> => {
                const { id }: any = req.params;
                const clothside: ClothSideInstance | null = await models.ClothSide.findByPk(id);
                if (!clothside) throw new NotFoundError('ClothSide tidak ditemukan');
                await clothside.destroy();
                const body: OkResponse = { data: clothside };

                res.json(body);
            },
        ),
    );

    return router;
};

export default clothsidesRoutes;
