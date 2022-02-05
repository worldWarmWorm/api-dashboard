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
import { User } from '../User';
import { UserService } from '../UserService';
import { ValidateMiddleware } from '../../../common/middleware/ValidateMiddleware';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(
		@inject(TYPES.ILogger)
		private loggerService: ILogger,

		@inject(TYPES.UserService)
		private userService: UserService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HttpError(401, 'Not logined', 'login'));
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.userService.createUser(body);
		if (!result) {
			return next(new HttpError(422, 'User like that already exist'));
		}
		this.ok(res, { email: result.email, id: result.id });
	}
}
