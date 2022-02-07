import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../common/BaseController';
import { HttpError } from '../../../errors/HttpError';
import { ILogger } from '../../../logger/ILogger';
import { TYPES } from '../../../types';
import 'reflect-metadata';
import { IUsersController } from './IUsersController';
import { UserLoginDto } from '../dto/UserLoginDto';
import { UserRegisterDto } from '../dto/UserRegisterDto';
import { ValidateMiddleware } from '../../../common/middleware/ValidateMiddleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../../../config/IConfigService';
import { IUserService } from '../IUserService';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger)
		private loggerService: ILogger,

		@inject(TYPES.UserService)
		private userService: IUserService,

		@inject(TYPES.ConfigService)
		private configService: IConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				middlewares: [],
			},
		]);
	}

	async login(
		req: Request<{}, {}, UserLoginDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.validateUser(req.body);

		if (!result) {
			return next(new HttpError(401, 'Authorisation error'));
		}

		const jwt = await this.signJWT(req.body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'User like that already exist'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}

	async info(req: Request, res: Response, next: NextFunction): Promise<void> {
		this.ok(res, { email: req.user });
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			sign(
				{
					email,
					issueAt: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						reject(err);
					}
					resolve(token as string);
				},
			);
		});
	}
}
