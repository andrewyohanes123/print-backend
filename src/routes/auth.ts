import express from 'express';
import bcrypt from 'bcrypt';
import ModelFactoryInterface from '../models/typings/ModelFactoryInterface';
import { Routes, ObjectKeyValue } from './typings/RouteInterface';
import { OkResponse } from './typings/BodyBuilderInterface';
import a from '../middlewares/wrapper/a';
import * as validation from './auth.validation';
import { UserInstance } from '../models/User';
import { TokenStructureResponse, generateTokens } from '../middlewares/pipes/token';
import AuthError from '../classes/AuthError';

const route: Routes = (app: express.Application, models: ModelFactoryInterface): express.Router => {
	const router: express.Router = express.Router();
	const { User, Token }: ModelFactoryInterface = models;

	router.get(
		'/',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				// @ts-ignore
				if (!req.user) throw new AuthError('Sesi habis');
				// @ts-ignore
				const body: OkResponse = { data: req.user };
				// @ts-ignore
				res.json(body);
			},
		),
	);

	router.post(
		'/',
		validation.login,
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				// @ts-ignore
				const { username, password }: { username: string; password: string } = req.body;
				const user: UserInstance | null = await User.findOne({ where: { username: username } });
				if (user) {
					if (bcrypt.compareSync(password, user.password)) {
						await Token.update({ used: true }, { where: { user_id: user.id || 0 } });
						const tokens: TokenStructureResponse | ObjectKeyValue = await generateTokens(
							user.id || 0,
							models,
						);
						const response: OkResponse = { data: { tokens, user } };
						// @ts-ignore
						res.json(response);
					} else throw new AuthError('Login tidak valid');
				} else throw new AuthError('Login tidak valid');
			},
		),
	);

	router.delete(
		'/',
		a(
			async (req: express.Request, res: express.Response): Promise<void> => {
				// @ts-ignore
				if (req.user) {
					// @ts-ignore
					await Token.update({ used: true }, { where: { user_id: req.user.id || 0 } });
				}
				const response: OkResponse = { data: 'Logout berhasil' };
				// @ts-ignore
				res.set('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
				// @ts-ignore
				res.set('x-access-token', '');
				// @ts-ignore
				res.set('x-refresh-token', '');
				// @ts-ignore
				res.json(response);
			},
		),
	);

	return router;
};

export default route;
