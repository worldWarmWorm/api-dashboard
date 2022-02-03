import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../common/BaseController';
import { HttpError } from '../../errors/HttpError';
import { ILogger } from '../../logger/ILogger';
import { TYPES } from '../../types';
import 'reflect-metadata';
import { IUsersController } from './IUsersController';
import { UserLoginDto } from '../../entity/users/dto/UserLoginDto';
import { UserRegisterDto } from '../../entity/users/dto/UserRegisterDto';
import { User } from '../../entity/users/User';

@injectable()
export class UsersController extends BaseController implements IUsersController {
	constructor(@inject(TYPES.ILogger) private LoggerService: ILogger) {
		super(LoggerService);
		this.bindRoutes([
			{ path: '/register', method: 'post', func: this.register },
			{ path: '/login', method: 'post', func: this.login },
		]);
	}

	login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
		console.log(req.body);
		next(new HttpError(401, 'Not logined', 'login'));
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const newUser = new User(body.email, body.name);
		await newUser.setPassword(body.password);
		this.ok(res, newUser);
	}
}
